import hashlib

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import ADMIN_TOKENS, AdminUser, Base, ContactEnquiry, QuoteEnquiry, app, get_db, issue_admin_token


@pytest.fixture
def test_db():
    engine = create_engine(
        'sqlite://',
        connect_args={'check_same_thread': False},
        poolclass=StaticPool,
    )
    test_session_local = sessionmaker(bind=engine, autocommit=False, autoflush=False)
    Base.metadata.create_all(bind=engine)
    yield test_session_local
    engine.dispose()


@pytest.fixture
def client(test_db):
    previous_override = app.dependency_overrides.get(get_db)

    def override_get_db():
        with test_db() as db:
            yield db

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    if previous_override is None:
        app.dependency_overrides.pop(get_db, None)
    else:
        app.dependency_overrides[get_db] = previous_override


def test_root_health_check(client):
    response = client.get('/')

    assert response.status_code == 200
    assert response.json() == {'status': 'ok'}


def test_contact_enquiry_is_persisted(client, test_db):
    payload = {
        'full_name': 'Ada Okafor',
        'business_email': 'ada.contact@example.com',
        'company_name': 'GreenBolt',
        'country': 'Nigeria',
        'enquiry_type': 'product enquiry',
        'subject': 'Lithium product details',
        'message': 'Please share details about your lithium products.',
        'commodity': 'lithium',
    }

    response = client.post('/api/contact-enquiries', json=payload)

    assert response.status_code == 200
    result = response.json()
    assert result['success'] is True
    assert result['enquiry_reference'].startswith('KS-C-')

    with test_db() as db:
        saved = db.query(ContactEnquiry).filter_by(reference=result['enquiry_reference']).one()

    assert saved.full_name == payload['full_name']
    assert saved.business_email == payload['business_email']
    assert saved.company_name == payload['company_name']
    assert saved.country == payload['country']
    assert saved.enquiry_type == payload['enquiry_type']
    assert saved.subject == payload['subject']
    assert saved.message == payload['message']
    assert saved.commodity == payload['commodity']


def test_admin_can_list_contact_enquiries(client):
    payload = {
        'full_name': 'Ada Okafor',
        'business_email': 'ada.contact@example.com',
        'company_name': 'GreenBolt',
        'country': 'Nigeria',
        'enquiry_type': 'product enquiry',
        'subject': 'Copper supply enquiry',
        'message': 'Please share current copper supply information.',
        'commodity': 'copper',
    }
    submitted = client.post('/api/contact-enquiries', json=payload)
    token = issue_admin_token()

    try:
        response = client.get(
            '/api/admin/contact-enquiries',
            headers={'Authorization': f'Bearer {token}'},
        )
    finally:
        ADMIN_TOKENS.discard(token)

    assert response.status_code == 200
    assert response.json() == [{
        'id': 1,
        'reference': submitted.json()['enquiry_reference'],
        **payload,
        'created_at': response.json()[0]['created_at'],
    }]


def test_admin_contact_enquiries_require_authentication(client):
    response = client.get('/api/admin/contact-enquiries')

    assert response.status_code == 401


def test_admin_can_create_other_admin_accounts(client, test_db):
    with test_db() as db:
        db.add(AdminUser(
            email='root@example.com',
            password_hash=hashlib.sha256('legacy-password'.encode('utf-8')).hexdigest(),
        ))
        db.commit()

    unauthenticated = client.post(
        '/api/admin/users',
        json={'email': 'new-admin@example.com', 'password': 'long-enough-password'},
    )
    assert unauthenticated.status_code == 401

    login_response = client.post(
        '/api/admin/login',
        json={'email': 'ROOT@example.com', 'password': 'legacy-password'},
    )
    assert login_response.status_code == 200
    token = login_response.json()['access_token']
    new_admin_token = None

    try:
        auth_headers = {'Authorization': f'Bearer {token}'}
        created = client.post(
            '/api/admin/users',
            headers=auth_headers,
            json={'email': 'New-Admin@example.com', 'password': 'long-enough-password'},
        )
        assert created.status_code == 201
        assert created.json() == {'email': 'new-admin@example.com'}

        duplicate = client.post(
            '/api/admin/users',
            headers=auth_headers,
            json={'email': 'NEW-ADMIN@example.com', 'password': 'long-enough-password'},
        )
        assert duplicate.status_code == 409

        short_password = client.post(
            '/api/admin/users',
            headers=auth_headers,
            json={'email': 'another-admin@example.com', 'password': 'short'},
        )
        assert short_password.status_code == 422

        new_admin_login = client.post(
            '/api/admin/login',
            json={'email': 'new-admin@example.com', 'password': 'long-enough-password'},
        )
        assert new_admin_login.status_code == 200
        new_admin_token = new_admin_login.json()['access_token']

        with test_db() as db:
            created_admin = db.query(AdminUser).filter_by(email='new-admin@example.com').one()
            upgraded_admin = db.query(AdminUser).filter_by(email='root@example.com').one()
        assert created_admin.password_hash.startswith('pbkdf2_sha256$')
        assert created_admin.password_hash != 'long-enough-password'
        assert upgraded_admin.password_hash.startswith('pbkdf2_sha256$')
    finally:
        ADMIN_TOKENS.discard(token)
        if new_admin_token:
            ADMIN_TOKENS.discard(new_admin_token)


@pytest.mark.parametrize(
    'payload',
    [
        {},
        {
            'full_name': 'Ada Okafor',
            'business_email': 'not-an-email',
            'country': 'Nigeria',
            'enquiry_type': 'general enquiry',
            'subject': 'A question',
            'message': 'Please contact me.',
        },
        {
            'full_name': 'Ada Okafor',
            'business_email': 'ada@example.com',
            'country': 'Nigeria',
            'enquiry_type': 'invalid enquiry',
            'subject': 'A question',
            'message': 'Please contact me.',
        },
        {
            'full_name': 'Ada Okafor',
            'business_email': 'ada@example.com',
            'country': 'Nigeria',
            'enquiry_type': 'general enquiry',
            'subject': 'A question',
            'message': 'Please contact me.',
            'commodity': 'gold',
        },
        {
            'full_name': 'Ada Okafor',
            'business_email': 'ada@example.com',
            'country': 'Nigeria',
            'enquiry_type': 'general enquiry',
            'subject': '  ',
            'message': 'Please contact me.',
        },
    ],
)
def test_contact_enquiry_rejects_invalid_payloads(client, payload):
    response = client.post('/api/contact-enquiries', json=payload)

    assert response.status_code == 422


def test_contact_enquiry_allows_optional_company_and_commodity(client):
    response = client.post(
        '/api/contact-enquiries',
        json={
            'full_name': 'Ada Okafor',
            'business_email': 'ada.optional@example.com',
            'country': 'Nigeria',
            'enquiry_type': 'general enquiry',
            'subject': 'General question',
            'message': 'Please contact me about your business.',
        },
    )

    assert response.status_code == 200


def test_quote_enquiry_persists_every_quote_form_field(client, test_db):
    payload = {
        'full_name': 'Ada Okafor',
        'business_email': 'ada.quote@example.com',
        'company_name': 'GreenBolt Ltd',
        'country': 'Nigeria',
        'phone_number': '+2348000000000',
        'commodity': 'Copper cathodes',
        'required_specification': '99.9% purity',
        'quantity': '25 metric tons',
        'packaging_requirements': 'Palletized bundles',
        'destination_country': 'China',
        'delivery_location': 'Shanghai Port',
        'preferred_incoterms': 'FOB Lagos',
        'expected_delivery_timeframe': 'Q3 2026',
        'additional_requirements': 'Independent inspection requested',
        'consent_to_privacy_notice': True,
    }

    response = client.post('/api/quotes', json=payload)

    assert response.status_code == 200
    result = response.json()
    assert result['success'] is True

    with test_db() as db:
        saved = db.query(QuoteEnquiry).filter_by(reference=result['enquiry_reference']).one()

    for field, value in payload.items():
        assert getattr(saved, field) == value


def test_contact_quote_details_are_persisted_in_message(client, test_db):
    message = '\n\n'.join([
        'Product specification: Grade A cathodes',
        'Required quantity: 25 metric tons',
        'Destination: Shanghai, China',
        'Preferred delivery terms: FOB Lagos',
        'Please review this product enquiry.',
    ])
    payload = {
        'full_name': 'Ada Okafor',
        'business_email': 'ada.contact@example.com',
        'company_name': 'GreenBolt Ltd',
        'country': 'Nigeria',
        'enquiry_type': 'request a quotation',
        'subject': 'Copper enquiry',
        'message': message,
        'commodity': 'copper',
    }

    response = client.post('/api/contact-enquiries', json=payload)

    assert response.status_code == 200
    with test_db() as db:
        saved = db.query(ContactEnquiry).filter_by(reference=response.json()['enquiry_reference']).one()

    assert saved.message == message
    assert saved.company_name == payload['company_name']
    assert saved.commodity == payload['commodity']


@pytest.mark.parametrize('origin', ['http://localhost:5173', 'http://127.0.0.1:5173'])
def test_contact_enquiry_allows_local_frontend_cors(client, origin):
    response = client.options(
        '/api/contact-enquiries',
        headers={
            'Origin': origin,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'content-type',
        },
    )

    assert response.status_code == 200
    assert response.headers['access-control-allow-origin'] == origin
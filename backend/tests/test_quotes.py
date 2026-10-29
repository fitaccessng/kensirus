from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import ADMIN_TOKENS, AdminUser, Base, QuoteEnquiry, app, get_db, hash_password

client = TestClient(app)


def test_health_check():
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json()['status'] == 'ok'


def test_quote_submission_requires_required_fields():
    response = client.post('/api/quotes', json={})
    assert response.status_code == 422


def test_quote_submission_accepts_valid_payload():
    payload = {
        'full_name': 'Ada Okafor',
        'business_email': 'ada@example.com',
        'company_name': 'GreenBolt',
        'country': 'Nigeria',
        'phone_number': '+2348000000000',
        'commodity': 'Lithium',
        'required_specification': 'Battery grade',
        'quantity': '200 metric tons',
        'packaging_requirements': 'Bulk container',
        'destination_country': 'China',
        'delivery_location': 'Shanghai',
        'preferred_incoterms': 'FOB',
        'expected_delivery_timeframe': 'Q4 2026',
        'consent_to_privacy_notice': True,
    }
    response = client.post('/api/quotes', json=payload)
    assert response.status_code == 200
    assert 'enquiry_reference' in response.json()


def test_quote_submission_persists_every_submitted_field():
    engine = create_engine(
        'sqlite://',
        connect_args={'check_same_thread': False},
        poolclass=StaticPool,
    )
    test_session_local = sessionmaker(bind=engine, autocommit=False, autoflush=False)
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        with test_session_local() as db:
            yield db

    previous_override = app.dependency_overrides.get(get_db)
    app.dependency_overrides[get_db] = override_get_db
    payload = {
        'full_name': 'Ada Okafor',
        'business_email': 'ada.persistence@example.com',
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

    try:
        with TestClient(app) as test_client:
            response = test_client.post('/api/quotes', json=payload)
        assert response.status_code == 200
        reference = response.json()['enquiry_reference']
        with test_session_local() as db:
            saved = db.query(QuoteEnquiry).filter_by(reference=reference).one()
        for field, value in payload.items():
            assert getattr(saved, field) == value
    finally:
        if previous_override is None:
            app.dependency_overrides.pop(get_db, None)
        else:
            app.dependency_overrides[get_db] = previous_override
        engine.dispose()


def test_admin_login_and_enquiry_protection():
    engine = create_engine(
        'sqlite://',
        connect_args={'check_same_thread': False},
        poolclass=StaticPool,
    )
    test_session_local = sessionmaker(bind=engine, autocommit=False, autoflush=False)
    Base.metadata.create_all(bind=engine)
    previous_override = app.dependency_overrides.get(get_db)

    def override_get_db():
        with test_session_local() as db:
            yield db

    app.dependency_overrides[get_db] = override_get_db
    with test_session_local() as db:
        db.add(AdminUser(email='admin@example.com', password_hash=hash_password('test-password')))
        db.commit()

    token = None
    try:
        with TestClient(app) as test_client:
            login_response = test_client.post(
                '/api/admin/login',
                json={'email': 'admin@example.com', 'password': 'test-password'},
            )
            assert login_response.status_code == 200
            token = login_response.json()['access_token']

            enquiries_response = test_client.get(
                '/api/admin/enquiries',
                headers={'Authorization': f'Bearer {token}'},
            )
            assert enquiries_response.status_code == 200
            assert isinstance(enquiries_response.json(), list)
    finally:
        if token:
            ADMIN_TOKENS.discard(token)
        if previous_override is None:
            app.dependency_overrides.pop(get_db, None)
        else:
            app.dependency_overrides[get_db] = previous_override
        engine.dispose()

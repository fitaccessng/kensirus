import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import (
    ADMIN_TOKENS,
    Base,
    BrandLogo,
    app,
    get_db,
    issue_admin_token,
)


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


def test_logo_upload_requires_admin_authentication(client):
    response = client.post(
        '/api/admin/logo',
        content=b'\x89PNG\r\n\x1a\nlogo',
        headers={'Content-Type': 'image/png'},
    )

    assert response.status_code == 401


def test_logo_upload_is_persisted_and_served(client, test_db):
    token = issue_admin_token()
    image = b'\x89PNG\r\n\x1a\nlogo-image'
    response = client.post(
        '/api/admin/logo',
        content=image,
        headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'image/png',
        },
    )

    assert response.status_code == 200
    assert response.json() == {'success': True}

    public_response = client.get('/api/site/logo')
    assert public_response.status_code == 200
    assert public_response.content == image
    assert public_response.headers['content-type'] == 'image/png'
    assert public_response.headers['cache-control'] == 'no-store'

    with test_db() as db:
        saved = db.get(BrandLogo, 1)
    assert saved is not None
    assert saved.content_type == 'image/png'
    assert saved.image_data == image

    ADMIN_TOKENS.discard(token)


def test_logo_upload_rejects_mismatched_image_content(client):
    token = issue_admin_token()
    response = client.post(
        '/api/admin/logo',
        content=b'not a png',
        headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'image/png',
        },
    )
    ADMIN_TOKENS.discard(token)

    assert response.status_code == 400


def test_logo_upload_rejects_files_over_two_megabytes(client):
    token = issue_admin_token()
    response = client.post(
        '/api/admin/logo',
        content=b'\x89PNG\r\n\x1a\n' + (b'x' * (2 * 1024 * 1024)),
        headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'image/png',
        },
    )
    ADMIN_TOKENS.discard(token)

    assert response.status_code == 413

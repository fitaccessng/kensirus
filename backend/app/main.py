import hashlib
import hmac
import os
import secrets
import uuid
from datetime import datetime, timezone
from typing import Literal, Optional

from fastapi import Depends, FastAPI, Header, HTTPException, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from sqlalchemy import Boolean, Column, DateTime, Integer, LargeBinary, String, create_engine, func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker


APP_ENV = os.getenv('APP_ENV', 'development').strip().lower()
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///./ken_sirius.db')
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD')
IS_PRODUCTION = APP_ENV in {'production', 'prod'}

if IS_PRODUCTION:
    if DATABASE_URL.startswith('sqlite:'):
        raise RuntimeError('DATABASE_URL must use a managed database in production.')
    if not ADMIN_PASSWORD:
        raise RuntimeError('ADMIN_PASSWORD must be set in production.')

if DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql+psycopg://', 1)
elif DATABASE_URL.startswith('postgresql://'):
    DATABASE_URL = DATABASE_URL.replace('postgresql://', 'postgresql+psycopg://', 1)


class Base(DeclarativeBase):
    pass


engine_options = {'connect_args': {'check_same_thread': False}} if DATABASE_URL.startswith('sqlite:') else {}
engine = create_engine(DATABASE_URL, **engine_options)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


class QuoteEnquiry(Base):
    __tablename__ = 'quote_enquiries'

    id = Column(Integer, primary_key=True, index=True)
    reference = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    business_email = Column(String, nullable=False)
    company_name = Column(String, nullable=False)
    country = Column(String, nullable=False)
    phone_number = Column(String, nullable=False)
    commodity = Column(String, nullable=False)
    required_specification = Column(String, nullable=True)
    quantity = Column(String, nullable=True)
    packaging_requirements = Column(String, nullable=True)
    destination_country = Column(String, nullable=True)
    delivery_location = Column(String, nullable=True)
    preferred_incoterms = Column(String, nullable=True)
    expected_delivery_timeframe = Column(String, nullable=True)
    additional_requirements = Column(String, nullable=True)
    consent_to_privacy_notice = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)


class ContactEnquiry(Base):
    __tablename__ = 'contact_enquiries'

    id = Column(Integer, primary_key=True, index=True)
    reference = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    business_email = Column(String, nullable=False)
    company_name = Column(String, nullable=True)
    country = Column(String, nullable=False)
    enquiry_type = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    message = Column(String, nullable=False)
    commodity = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)


class AdminUser(Base):
    __tablename__ = 'admin_users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)


class BrandLogo(Base):
    __tablename__ = 'brand_logos'

    id = Column(Integer, primary_key=True)
    content_type = Column(String, nullable=False)
    image_data = Column(LargeBinary, nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)


Base.metadata.create_all(bind=engine)

DEFAULT_ADMIN_EMAIL = os.getenv('ADMIN_EMAIL', 'admin@ken-sirius.com')
DEFAULT_ADMIN_PASSWORD = ADMIN_PASSWORD or 'admin123'
ADMIN_TOKENS = set()


app = FastAPI(title='Ken Sirius API', version='0.1.0')
allowed_origins = [
    origin.strip()
    for origin in os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173').split(',')
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=['GET', 'POST', 'OPTIONS'],
    allow_headers=['Authorization', 'Content-Type'],
)
security = HTTPBearer(auto_error=False)
MAX_LOGO_SIZE = 2 * 1024 * 1024
LOGO_SIGNATURES = {
    'image/png': lambda data: data.startswith(b'\x89PNG\r\n\x1a\n'),
    'image/jpeg': lambda data: data.startswith(b'\xff\xd8\xff'),
    'image/webp': lambda data: len(data) >= 12 and data[:4] == b'RIFF' and data[8:12] == b'WEBP',
}


class QuoteSubmission(BaseModel):
    model_config = ConfigDict(extra='forbid')

    full_name: str = Field(..., min_length=2)
    business_email: EmailStr
    company_name: str = Field(..., min_length=2)
    country: str = Field(..., min_length=2)
    phone_number: str = Field(..., min_length=7)
    commodity: str = Field(..., min_length=2)
    required_specification: Optional[str] = None
    quantity: Optional[str] = None
    packaging_requirements: Optional[str] = None
    destination_country: Optional[str] = None
    delivery_location: Optional[str] = None
    preferred_incoterms: Optional[str] = None
    expected_delivery_timeframe: Optional[str] = None
    additional_requirements: Optional[str] = None
    consent_to_privacy_notice: bool = Field(...)


class QuoteResponse(BaseModel):
    success: bool
    message: str
    enquiry_reference: str


class ContactEnquirySubmission(BaseModel):
    model_config = ConfigDict(extra='forbid', str_strip_whitespace=True)

    full_name: str = Field(..., min_length=2)
    business_email: EmailStr
    company_name: Optional[str] = Field(default=None, min_length=2)
    country: str = Field(..., min_length=2)
    enquiry_type: Literal[
        'product enquiry',
        'request a quotation',
        'documentation',
        'business partnership',
        'general enquiry',
    ]
    subject: str = Field(..., min_length=2)
    message: str = Field(..., min_length=1)
    commodity: Optional[Literal['lithium', 'copper', 'cassava', 'other']] = None


class ContactEnquiryResponse(BaseModel):
    success: bool
    message: str
    enquiry_reference: str


class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str


class AdminCreateRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=12, max_length=128)


class AdminLoginResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'


class EnquiryRecord(BaseModel):
    id: int
    reference: str
    full_name: str
    business_email: str
    company_name: str
    country: str
    phone_number: str
    commodity: str
    required_specification: Optional[str] = None
    quantity: Optional[str] = None
    packaging_requirements: Optional[str] = None
    destination_country: Optional[str] = None
    delivery_location: Optional[str] = None
    preferred_incoterms: Optional[str] = None
    expected_delivery_timeframe: Optional[str] = None
    additional_requirements: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ContactEnquiryRecord(BaseModel):
    id: int
    reference: str
    full_name: str
    business_email: str
    company_name: Optional[str] = None
    country: str
    enquiry_type: str
    subject: str
    message: str
    commodity: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 310_000)
    return f'pbkdf2_sha256$310000${salt.hex()}${digest.hex()}'


def verify_password(password: str, password_hash: str) -> bool:
    if not password_hash.startswith('pbkdf2_sha256$'):
        legacy_hash = hashlib.sha256(password.encode('utf-8')).hexdigest()
        return hmac.compare_digest(password_hash, legacy_hash)

    try:
        algorithm, iterations, salt, digest = password_hash.split('$')
        if algorithm != 'pbkdf2_sha256':
            return False
        calculated = hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            bytes.fromhex(salt),
            int(iterations),
        ).hex()
    except (ValueError, TypeError):
        return False

    return hmac.compare_digest(calculated, digest)


def create_default_admin():
    with SessionLocal() as db:
        existing_admin = db.query(AdminUser).filter(
            func.lower(AdminUser.email) == DEFAULT_ADMIN_EMAIL.lower()
        ).first()
        if existing_admin is None:
            db.add(
                AdminUser(
                    email=DEFAULT_ADMIN_EMAIL,
                    password_hash=hash_password(DEFAULT_ADMIN_PASSWORD),
                )
            )
            db.commit()
        elif not IS_PRODUCTION:
            existing_admin.password_hash = hash_password(DEFAULT_ADMIN_PASSWORD)
            db.commit()


create_default_admin()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def issue_admin_token() -> str:
    token = secrets.token_urlsafe(32)
    ADMIN_TOKENS.add(token)
    return token


def get_current_admin_token(
    authorization: Optional[HTTPAuthorizationCredentials] = Depends(security),
):
    if authorization is None or authorization.scheme.lower() != 'bearer':
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Authentication required.')

    token = authorization.credentials
    if token not in ADMIN_TOKENS:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid authentication token.')

    return token


@app.get('/health')
def health_check():
    return {'status': 'ok'}


@app.post('/api/admin/login', response_model=AdminLoginResponse)
def admin_login(payload: AdminLoginRequest, db: Session = Depends(get_db)):
    admin = db.query(AdminUser).filter(
        func.lower(AdminUser.email) == str(payload.email).lower()
    ).first()
    if admin is None or not verify_password(payload.password, admin.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Invalid admin credentials.')

    if not admin.password_hash.startswith('pbkdf2_sha256$'):
        admin.password_hash = hash_password(payload.password)
        db.commit()

    return {'access_token': issue_admin_token(), 'token_type': 'bearer'}


@app.post('/api/admin/users', status_code=status.HTTP_201_CREATED)
def create_admin_user(
    payload: AdminCreateRequest,
    _token: str = Depends(get_current_admin_token),
    db: Session = Depends(get_db),
):
    email = str(payload.email).lower()
    existing_admin = db.query(AdminUser).filter(
        func.lower(AdminUser.email) == email
    ).first()
    if existing_admin is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='An admin with this email already exists.')

    db.add(AdminUser(email=email, password_hash=hash_password(payload.password)))
    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail='An admin with this email already exists.',
        ) from error

    return {'email': email}


@app.get('/api/admin/enquiries', response_model=list[EnquiryRecord])
def list_enquiries(_token: str = Depends(get_current_admin_token), db: Session = Depends(get_db)):
    enquiries = db.query(QuoteEnquiry).order_by(QuoteEnquiry.created_at.desc()).all()
    return enquiries


@app.get('/api/admin/contact-enquiries', response_model=list[ContactEnquiryRecord])
def list_contact_enquiries(_token: str = Depends(get_current_admin_token), db: Session = Depends(get_db)):
    enquiries = db.query(ContactEnquiry).order_by(ContactEnquiry.created_at.desc()).all()
    return enquiries


@app.get('/api/site/logo')
def get_site_logo(db: Session = Depends(get_db)):
    logo = db.get(BrandLogo, 1)
    if logo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='No uploaded logo.')

    return Response(
        content=logo.image_data,
        media_type=logo.content_type,
        headers={'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'},
    )


@app.post('/api/admin/logo')
async def upload_site_logo(
    request: Request,
    _token: str = Depends(get_current_admin_token),
    db: Session = Depends(get_db),
):
    content_type = request.headers.get('content-type', '').split(';', 1)[0].strip().lower()
    signature_check = LOGO_SIGNATURES.get(content_type)
    if signature_check is None:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail='Upload a PNG, JPEG, or WebP image.',
        )

    image_data = bytearray()
    async for chunk in request.stream():
        image_data.extend(chunk)
        if len(image_data) > MAX_LOGO_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail='Logo files must be 2 MB or smaller.',
            )

    if not signature_check(image_data):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='The file contents do not match the selected image format.',
        )

    logo = db.get(BrandLogo, 1)
    if logo is None:
        logo = BrandLogo(id=1, content_type=content_type, image_data=bytes(image_data))
        db.add(logo)
    else:
        logo.content_type = content_type
        logo.image_data = bytes(image_data)
        logo.updated_at = datetime.now(timezone.utc)
    db.commit()

    return {'success': True}


@app.post('/api/quotes', response_model=QuoteResponse)
def submit_quote(payload: QuoteSubmission, db: Session = Depends(get_db)):
    if not payload.consent_to_privacy_notice:
        raise HTTPException(status_code=400, detail='Consent to privacy notice is required.')

    enquiry_reference = f'KS-{uuid.uuid4().hex[:8].upper()}'
    enquiry = QuoteEnquiry(
        reference=enquiry_reference,
        full_name=payload.full_name,
        business_email=str(payload.business_email),
        company_name=payload.company_name,
        country=payload.country,
        phone_number=payload.phone_number,
        commodity=payload.commodity,
        required_specification=payload.required_specification,
        quantity=payload.quantity,
        packaging_requirements=payload.packaging_requirements,
        destination_country=payload.destination_country,
        delivery_location=payload.delivery_location,
        preferred_incoterms=payload.preferred_incoterms,
        expected_delivery_timeframe=payload.expected_delivery_timeframe,
        additional_requirements=payload.additional_requirements,
        consent_to_privacy_notice=payload.consent_to_privacy_notice,
    )
    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)

    return {
        'success': True,
        'message': 'Enquiry submitted successfully.',
        'enquiry_reference': enquiry_reference,
    }


@app.post('/api/contact-enquiries', response_model=ContactEnquiryResponse)
def submit_contact_enquiry(payload: ContactEnquirySubmission, db: Session = Depends(get_db)):
    enquiry_reference = f'KS-C-{uuid.uuid4().hex[:8].upper()}'
    enquiry = ContactEnquiry(
        reference=enquiry_reference,
        full_name=payload.full_name,
        business_email=str(payload.business_email),
        company_name=payload.company_name,
        country=payload.country,
        enquiry_type=payload.enquiry_type,
        subject=payload.subject,
        message=payload.message,
        commodity=payload.commodity,
    )
    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)

    return {
        'success': True,
        'message': 'Contact enquiry submitted successfully.',
        'enquiry_reference': enquiry.reference,
    }

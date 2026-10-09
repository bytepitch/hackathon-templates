from datetime import datetime, timezone

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from sqlalchemy import DateTime
from sqlmodel import Field, SQLModel


def now():
    return datetime.now(timezone.utc)


# The database table. Any class with table=True is created on startup
class Item(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    created_at: datetime = Field(default_factory=now, sa_type=DateTime(timezone=True))


# Base for everything that goes in or out as JSON.
# The JSON uses camelCase (createdAt) while Python keeps snake_case (created_at)
class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


# What the client sends to create an item
class ItemCreate(CamelModel):
    name: str


# What the API sends back
class ItemRead(CamelModel):
    id: int
    name: str
    created_at: datetime

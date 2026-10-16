from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    # Each field is read from the env var with the same name (DATABASE_URL here).
    # Add your own settings below, then use them with `settings.your_field`
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/hackathon"
    cors_origins: list[str] = ["http://localhost:5173"]


settings = Settings()

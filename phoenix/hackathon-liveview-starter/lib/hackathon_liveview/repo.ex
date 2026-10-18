defmodule HackathonLiveView.Repo do
  use Ecto.Repo,
    otp_app: :hackathon_liveview,
    adapter: Ecto.Adapters.Postgres
end

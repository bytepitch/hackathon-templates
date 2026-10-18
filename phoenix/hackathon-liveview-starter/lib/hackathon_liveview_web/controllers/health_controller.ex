defmodule HackathonLiveViewWeb.HealthController do
  use HackathonLiveViewWeb, :controller

  def show(conn, _params) do
    json(conn, %{status: "ok"})
  end
end

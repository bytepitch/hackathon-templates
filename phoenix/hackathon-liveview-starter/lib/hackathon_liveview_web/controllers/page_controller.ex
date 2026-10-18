defmodule HackathonLiveViewWeb.PageController do
  use HackathonLiveViewWeb, :controller

  def home(conn, _params) do
    render(conn, :home)
  end
end

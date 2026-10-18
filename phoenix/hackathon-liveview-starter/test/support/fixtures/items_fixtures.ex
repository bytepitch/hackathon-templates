defmodule HackathonLiveView.ItemsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `HackathonLiveView.Items` context.
  """

  @doc """
  Generate a item.
  """
  def item_fixture(attrs \\ %{}) do
    {:ok, item} =
      attrs
      |> Enum.into(%{
        name: "some name"
      })
      |> HackathonLiveView.Items.create_item()

    item
  end
end

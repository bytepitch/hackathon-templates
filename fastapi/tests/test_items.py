def test_create_item(client):
    response = client.post("/api/items", json={"name": "Coffee"})

    assert response.status_code == 201
    item = response.json()
    assert item["name"] == "Coffee"
    assert "id" in item
    assert "createdAt" in item


def test_list_items(client):
    client.post("/api/items", json={"name": "Coffee"})
    client.post("/api/items", json={"name": "Tea"})

    response = client.get("/api/items")

    assert response.status_code == 200
    assert [item["name"] for item in response.json()] == ["Coffee", "Tea"]


def test_get_item(client):
    created = client.post("/api/items", json={"name": "Coffee"}).json()

    response = client.get(f"/api/items/{created['id']}")

    assert response.status_code == 200
    assert response.json() == created


def test_get_missing_item(client):
    response = client.get("/api/items/999")

    assert response.status_code == 404


def test_delete_item(client):
    created = client.post("/api/items", json={"name": "Coffee"}).json()

    response = client.delete(f"/api/items/{created['id']}")

    assert response.status_code == 204
    assert client.get(f"/api/items/{created['id']}").status_code == 404

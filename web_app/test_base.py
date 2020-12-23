# test_base.py
# Test that the app is up and running
#
# Run:
# $ py.test
# Or:
# $ python3 -m pytest


import flask
import os
import pytest
from webapp import app as web_app


@pytest.fixture
def app():
    yield web_app


@pytest.fixture
def client(app):
    return app.test_client()


def page_200(response):
    assert response.status_code == 200


def page_302(response):
    assert response.status_code == 302


def test_home(app, client):
    page_200(client.get("/"))


def test_stream(app, client):
    page_200(client.get("/stream"))




##

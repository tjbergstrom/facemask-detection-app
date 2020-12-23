# routes.py


from flask import render_template
from webapp import app


@app.route("/")
def home():
    return render_template("home.html")


@app.route("/stream")
def webcam():
    return render_template("stream.html")



##

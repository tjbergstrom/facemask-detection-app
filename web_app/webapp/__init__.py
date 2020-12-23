

from flask import Flask
app = Flask(__name__)
from webapp import routes

@app.route("/static/<path:path>")
def static_dir(path):
    return send_from_directory("static", path)



##

from flask import Flask, request, send_file
from flask_cors import CORS
from flask_restful import Api
import twisted
from twisted.internet import reactor
from twisted.web.server import Site
from twisted.web.wsgi import WSGIResource
from latex2pdf.latex2pdf import Latex2PDFHandler, FileHandler
from latex2pdf.constants import pdfFileName
import pathlib
from typing import IO
import base64

app = Flask(__name__)
CORS(app, origins="*")
api = Api(app)
api.add_resource(Latex2PDFHandler, '/api/Latex2PDFHandler/')

fileHandler = FileHandler()

@app.route('/api/readPDF/<path:path>')
def readPDF(path)->IO[bytes]:
  """Send PDF file to user"""
  path = fileHandler.validateFolderPath(path)
  pdfPath = path + pdfFileName
  pdf = open(pdfPath, 'rb')
  return send_file(pdf, mimetype='application/pdf')

@app.route('/api/readApplicationPDF/<path:path>')
def readApplicationPDF(path)->IO[bytes]:
  """Send PDF file to user"""
  path = fileHandler.validateFolderPath(path)
  pdfPath = path + "application.pdf"
  pdf = open(pdfPath, 'rb')
  return send_file(pdf, mimetype='application/pdf')

@app.route('/api/deletePDF/', methods=['GET', 'POST', 'PUT'])
def deletePDF()->str:
  """Delete project"""
  path_bas64 = request.args.get('path')
  path = base64.b64decode(path_bas64).decode("utf-8")
  fileHandler.deleteFolder(path)
  return "Success"

def run_twisted_wsgi():
    resource = WSGIResource(reactor, reactor.getThreadPool(), app)
    site = Site(resource)
    reactor.listenTCP(site, port=5000, debug=True, interface='0.0.0.0', host='0.0.0.0')
    reactor.run(**reactor_args)

if __name__ == "__main__":
    reactor_args = {}
    while True:
        try:
            run_twisted_wsgi()
        except:
            pass

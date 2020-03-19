from web_module import init_app
from config import Config

app = init_app()
app.run(host='127.0.0.1', port=80)

from web_module import init_app

app = init_app()
app.run()
app.run(host='0.0.0.0', debug=True)

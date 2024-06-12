import network
import time
from machine import Pin
from microdot import Microdot, Response
from ubinascii import a2b_base64

from config import wifi_config, www_credentials

# Constants
MAX_ALERT_DURATION = 10

wifi_ssid = wifi_config['ssid']
wifi_password = wifi_config['password']

# Basic Authentication credentials
auth_username = www_credentials['username']
auth_password = www_credentials['password']

# Assign output variables to GPIO pins
switch_pin = Pin(2, Pin.OUT)
led_builtin = Pin(2, Pin.OUT)

# Initialize the app
app = Microdot()
Response.default_content_type = 'text/plain'

def connect_to_wifi():
    wifi = network.WLAN(network.STA_IF)
    wifi.active(True)
    wifi.connect(wifi_ssid, wifi_password)
    while not wifi.isconnected():
        time.sleep(1)
    print('Connected to WiFi')
    print('Network config:', wifi.ifconfig())

def trigger_alert(duration):
    switch_pin.on()
    led_builtin.on()
    time.sleep(duration)
    switch_pin.off()
    led_builtin.off()

def check_auth(auth_header):
    if not auth_header or not auth_header.startswith('Basic '):
        return False
    print('auth_header:', auth_header)
    encoded_credentials = auth_header.split(' ', 1)[1]
    print('encoded_credentials:', encoded_credentials)
    credentials = a2b_base64(encoded_credentials).decode('utf-8')
    print('credentials:', credentials)
    username, password = credentials.split(':', 1)
    print('username:', username)
    print('password:', password)
    
    return username == auth_username and password == auth_password

def requires_auth(handler):
    def decorated_handler(request, *args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not check_auth(auth_header):
            return 'Unauthorized', 401, {
                'WWW-Authenticate': 'Basic realm="Login required"',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        return handler(request, *args, **kwargs)
    return decorated_handler

@app.route('/', methods=['GET'])
@requires_auth
def handle_root(request):
    return 'You have reached the remote-alerts device.'

@app.route('/alert', methods=['POST', 'OPTIONS'])
@requires_auth
def handle_post(request):
    if request.method == 'OPTIONS':
        return '', 204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }

    formData = request.form
    if 'duration' not in formData:
        return '400: Invalid Request - Body not received', 400, headers

    try:
        duration = int(formData['duration'])
    except ValueError:
        return 'Invalid request received: {}'.format(formData['duration']), 400, headers

    if 0 < duration <= MAX_ALERT_DURATION:
        trigger_alert(duration)
        return 'Received valid request of {} seconds.'.format(duration), 200, headers
    else:
        return 'Invalid request received: {}'.format(duration), 400, headers

def main():
    connect_to_wifi()

    led_builtin.off()
    time.sleep(1)
    led_builtin.on()

    # Start the server
    app.run(host='0.0.0.0', port=8080)

if __name__ == '__main__':
    main()

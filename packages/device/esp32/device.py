import network
import time
from machine import Pin
from microdot import Microdot, Response
import neopixel
from ubinascii import a2b_base64
from config import wifi_config, www_credentials

from microdot.cors import CORS

# Constants
MAX_ALERT_DURATION = 10

# WiFi credentials
wifi_ssid = wifi_config['ssid']
wifi_password = wifi_config['password']

# Basic Authentication credentials
auth_username = www_credentials['username']
auth_password = www_credentials['password']

# GPIO pin assignments
switch_pin = Pin(2, Pin.OUT)
led_pin = Pin(21)

# Initialize WS2812 LED
led = neopixel.NeoPixel(led_pin, 1)

# Initialize the Microdot app
app = Microdot()
Response.default_content_type = 'text/plain'
CORS(app, allowed_origins=['*'], allow_credentials=True)

def set_color(r, g, b):
    """Set the WS2812 LED color."""
    led[0] = (g, r, b)
    led.write()

def connect_to_wifi():
    """Connect to the WiFi network."""
    wifi = network.WLAN(network.STA_IF)
    wifi.active(True)
    wifi.connect(wifi_ssid, wifi_password)
    while not wifi.isconnected():
        time.sleep(1)
    print('Connected to WiFi')
    print('Network config:', wifi.ifconfig())

def trigger_alert(duration):
    """Trigger an alert by turning on the switch and LED."""
    switch_pin.on()
    set_color(0, 0, 255)
    time.sleep(duration)
    switch_pin.off()
    set_color(0, 255, 0)

def check_auth(form_data):    
    """Check basic authentication credentials."""
    if not form_data or 'auth' not in form_data:
        return False
    credentials = a2b_base64(form_data['auth']).decode('utf-8')
    username, password = credentials.split(':', 1)
    print('username:', username)
    print('password:', password)
    return username == auth_username and password == auth_password

def requires_auth(handler):
    """Decorator to require basic authentication."""
    def decorated_handler(request, *args, **kwargs):
        formData = request.form
        if not check_auth(formData):
            return 'Unauthorized', 401, {
                'WWW-Authenticate': 'Basic realm="Login required"',
                'Access-Control-Allow-Origin': '*'
            }
        return handler(request, *args, **kwargs)
    
    return decorated_handler

@app.route('/', methods=['GET'])
@requires_auth
def handle_root(request):    
    headers = {}
    """Handle root endpoint."""
    return 'You have reached the remote-alerts device.', 200, headers

@app.route('/alert', methods=['POST'])
@requires_auth
def handle_post(request):
    print('[REQUEST] handle_post:', handle_post)
    
    """Handle alert endpoint."""
    headers = {
        'Access-Control-Allow-Origin': '*'
    }
    try:
        formData = request.form
    except:
        return '400: Invalid Request - Form data missing from request', 400, headers
        
    if not formData:
        return '400: Invalid Request - Form data is null', 400, headers
    
    if 'duration' not in formData:
        return '400: Invalid Request - Body not received', 400, headers

    try:
        duration = int(formData['duration'])
    except ValueError:
        return 'Invalid request received: {}'.format(formData['duration']), 400, headers

    if duration < 0 or duration > MAX_ALERT_DURATION:
        return 'Received invalid duration value: {}'.format(duration), 400, headers
    
    trigger_alert(duration)
    
    return 'Received valid request of {} seconds.'.format(duration), 200, headers        

def main():
    """Main function to run the server."""
    set_color(255, 0, 0)  # Red to indicate startup
    connect_to_wifi()
    set_color(0, 255, 0)  # Green to indicate ready

    # Start the server
    app.run(host='0.0.0.0', port=8080)

if __name__ == '__main__':
    main()

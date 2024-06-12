import network
import time
from machine import Pin
from MicroWebSrv2 import *
from config import wifi_config

MAX_ALERT_DURATION = 10

wifi_ssid = wifi_config['ssid']
wifi_password = wifi_config['password']

switch_pin = Pin(2, Pin.OUT)
led_builtin = Pin(3, Pin.OUT)

def connect_to_wifi():
    wifi = network.WLAN(network.STA_IF)
    wifi.active(True)
    wifi.connect(wifi_ssid, wifi_password)
    while not wifi.isconnected():
        time.sleep(1)
    print('Connected to WiFi')
    print('Network config:', wifi.ifconfig())

def trigger_alert(duration):
    duration_ms = duration * 1000
    switch_pin.on()
    led_builtin.on()
    time.sleep(duration)
    switch_pin.off()
    led_builtin.off()
# Define route handlers
def handle_root(httpClient, httpResponse):
    httpResponse.WriteResponseOk(
        headers=None,
        contentType='text/plain',
        contentCharset='UTF-8',
        content='You have reached the remote-alerts device.'
    )

def handle_post(httpClient, httpResponse):
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
    httpResponse.AddHeaders(headers)

    if httpClient.GetRequestMethod() == 'OPTIONS':
        httpResponse.WriteResponseOk(contentType='text/plain', contentCharset='UTF-8', content=None)
        return

    formData = httpClient.ReadRequestContentAsURLEncoded()
    if 'duration' not in formData:
        httpResponse.WriteResponseBadRequest(
            contentType='text/plain',
            contentCharset='UTF-8',
            content='400: Invalid Request - Body not received'
        )
        return

    try:
        duration = int(formData['duration'])
    except ValueError:
        duration = -1

    if 0 < duration <= MAX_ALERT_DURATION:
        httpResponse.WriteResponseOk(
            contentType='text/plain',
            contentCharset='UTF-8',
            content='Received valid request of {} seconds.'.format(duration)
        )
        trigger_alert(duration)
    else:
        httpResponse.WriteResponseBadRequest(
            contentType='text/plain',
            contentCharset='UTF-8',
            content='Invalid request received: {}'.format(duration)
        )

def main():
    connect_to_wifi()

    led_builtin.off()
    time.sleep(1)
    led_builtin.on()

    # Initialize the web server
    try:
        srv = MicroWebSrv2()
        srv.MaxRequestBodySize = 512  # Reduce request body size to save memory
        srv.BindAddress = ('0.0.0.0', 80)
        srv.StartManaged()

        # Add routes
        srv.AddRoute('/', 'GET', handle_root)
        srv.AddRoute('/alert', 'POST', handle_post)
        srv.AddRoute('/alert', 'OPTIONS', handle_post)
    except MicroWebSrv2Exception as e:
        print('Failed to start MicroWebSrv2:', e)
        return

    while True:
        time.sleep(1)

if __name__ == '__main__':
    main()
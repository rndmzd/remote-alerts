#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include "config.h"

#define MAX_ALERT_DURATION 10

// WiFi
const char *ssid = WIFI_SSID;
const char *password = WIFI_PASS;

// Basic Auth
const char *www_username = BASIC_AUTH_USERNAME;
const char *www_password = BASIC_AUTH_PASSWORD;

// Set web server port number to 80
ESP8266WebServer server(8080);

// Assign output variables to GPIO pins
const int switchPin = 2;

void handleRoot() {
  if (!server.authenticate(www_username, www_password)) {
    //return server.requestAuthentication();
    server.send(401, "text/plain", "401: Unauthorized");
    return;
  }
  
  server.send(200, "text/plain", "You have reached the remote-alerts device.");
}

void handlePost() {
  // Handle preflight (OPTIONS) requests
  if (server.method() == HTTP_OPTIONS) {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    server.sendHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    server.send(204);
    return;
  }

  if (!server.authenticate(www_username, www_password)) {
    //return server.requestAuthentication();
    server.send(401, "text/plain", "401: Unauthorized");
    return;
  }

  // Handle POST requests
  if (server.hasArg("plain") == false) {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(400, "text/plain", "400: Invalid Request - Body not recieved");
    return;
  }

  String body = server.arg("plain");
  String durationParam = server.arg("duration");

  server.sendHeader("Access-Control-Allow-Origin", "*");

  int duration = durationParam.toInt();
  if (0 < duration < MAX_ALERT_DURATION) {
    server.send(200, "text/plain", "Received valid request of " + durationParam + " seconds.");
    triggerAlert(duration);
  } else {
    server.send(400, "text/plain", "Invalid request received: " + durationParam);
  }
}

void setup() {
  //delay(10000);

  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
  digitalWrite(LED_BUILTIN, HIGH);

  // Initialize the output variables as outputs
  pinMode(switchPin, OUTPUT);
  // Set outputs to LOW
  digitalWrite(switchPin, LOW);

  // Connect to Wi-Fi network with SSID and password
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }

  server.on("/", HTTP_GET, handleRoot);
  server.on("/alert", HTTP_POST, handlePost);
  server.on("/alert", HTTP_OPTIONS, handlePost);
  server.begin();

  digitalWrite(LED_BUILTIN, LOW);
}

void loop() {
  server.handleClient();
}

void triggerAlert(int duration) {
  long durationMs = duration * 1000;

  digitalWrite(switchPin, HIGH);
  digitalWrite(LED_BUILTIN, HIGH);
  delay(durationMs);
  digitalWrite(switchPin, LOW);
  digitalWrite(LED_BUILTIN, LOW);
}
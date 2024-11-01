#include "WiFiS3.h"
#include <Servo.h>
#include "secrets.h"

#define SERVO_REST_POS 70
#define SERVO_SPRAY_POS 145

int ledPin = LED_BUILTIN;
int buttonPin = 2;
int servoPin = 9;
int status = WL_IDLE_STATUS;

WiFiServer server(8080);
Servo sprayServo;

void setup() {
  Serial.begin(115200);

  while (!Serial) {
    ;
  }

  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);

  pinMode(buttonPin, INPUT_PULLUP);

  sprayServo.attach(servoPin);
  sprayServo.write(SERVO_REST_POS);

  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    while (true)
      ;
  }

  String fv = WiFi.firmwareVersion();
  if (fv < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.println("Please upgrade the firmware.");
  }

  while (status != WL_CONNECTED) {
    Serial.print("Attempting connection to ");
    Serial.println(WIFI_SSID);

    status = WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    delay(10000);
  }
  server.begin();
  printWifiStatus();

  for (int i = 0; i < 5; i++) {
    digitalWrite(ledPin, HIGH);
    delay(100);
    digitalWrite(ledPin, LOW);
    delay(100);
  }
}


void loop() {
  WiFiClient client = server.available();

  if (client) {
    Serial.println("Client connected.");
    String currentLine = "";
    while (client.connected()) {
      if (client.available()) {
        char c = client.read();
        Serial.write(c);
        if (c == '\n') {

          // if the current line is blank, you got two newline characters in a row.
          // that's the end of the client HTTP request, so send a response:
          if (currentLine.length() == 0) {
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println();

            client.print("<p><a href=\"/spray\">Spray</a><br></p>");

            client.println();
            break;
          } else {  // if you got a newline, then clear currentLine:
            currentLine = "";
          }
        } else if (c != '\r') {  // if you got anything else but a carriage return character,
          currentLine += c;      // add it to the end of the currentLine
        }

        // Check to see if the client request was "GET /spray":
        if (currentLine.endsWith("POST /spray")) {
          triggerSpray();
        }
      }
    }
    client.stop();
    Serial.println("Client disconnected.");
  } else if (digitalRead(buttonPin) == 0) {
    while (digitalRead(buttonPin) == 0) delay(5);
    triggerSpray();
  }
  delay(10);
}

void triggerSpray() {
  Serial.println("Spray bottle activated.");
  digitalWrite(ledPin, HIGH);
  sprayServo.write(SERVO_SPRAY_POS);
  delay(1000);
  digitalWrite(ledPin, LOW);
  sprayServo.write(SERVO_REST_POS);
}

void printWifiStatus() {
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  long rssi = WiFi.RSSI();
  Serial.print("Signal RSSI:");
  Serial.print(rssi);
  Serial.println(" dBm");

  Serial.print("To see this page in action, open a browser to http://");
  Serial.print(ip);
  Serial.println(":8080");
}

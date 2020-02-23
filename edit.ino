

#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <FS.h>

String dataIn;
String dt[10];
int i;
boolean parsing = false;


IPAddress    apIP(42, 42, 42, 42);
const char* htmlfile = "/index.html";
const char *ssid = "PLANT";
const char *password = "12345678";
const char* host = "esp8266fs";
ESP8266WebServer server(80);



void parsingData() {
  int j = 0;
  dt[j] = "";
  for (i = 1; i < dataIn.length(); i++) {
    if ((dataIn[i] == '#') || (dataIn[i] == ',')) {
      j++;
      dt[j] = "";
    }
    else {
      dt[j] = dt[j] + dataIn[i];
    }
  }
  Serial.print("data masuk : ");
  Serial.print(dataIn);
  Serial.print("\n");
  Serial.print("data x : ");
  Serial.print(dt[0].toInt());
  Serial.print("\n");
  Serial.print("data 1 : ");
  Serial.print(dt[1].toInt());
  Serial.print("\n");
  Serial.print("data 2 : ");
  Serial.print(dt[2].toInt());
  Serial.print("\n");
  Serial.print("data 3 : ");
  Serial.print(dt[3].toInt());
  Serial.print("\n");
  Serial.print("data 4 : ");
  Serial.print(dt[4].toInt());
  Serial.print("\n");
  Serial.print("data 5 : ");
  Serial.print(dt[5].toInt());
  Serial.print("\n");
  Serial.print("data 6 : ");
  Serial.print(dt[6].toInt());
  Serial.print("\n");
  Serial.print("data 7 : ");
  Serial.print(dt[7].toInt());
  Serial.print("\n");
  String data = "{\"ADC\":\"" + String(dt[1].toInt()) + "\", \"GAS\":\"" + String(dt[2].toInt()) + "\",\"Temperature\":\"" + String(dt[3].toInt()) + "\",\"Humidity\":\"" + String(dt[4].toInt()) + "\",\"MERAH\":\"" + String(dt[5].toInt()) + "\",\"HIJAU\":\"" + String(dt[6].toInt()) + "\",\"BIRU\":\"" + String(dt[7].toInt()) + "\"}";
  server.send(200, "text/plane", data);
}

void handleRoot() {
  server.sendHeader("Location", "/index.html", true);
  server.send(302, "text/plane", "");
}

void handleWebRequests() {
  if (loadFromSpiffs(server.uri())) return;
  String message = "File Not Detected\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += (server.method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";
  for (uint8_t i = 0; i < server.args(); i++) {
    message += " NAME:" + server.argName(i) + "\n VALUE:" + server.arg(i) + "\n";
  }
  server.send(404, "text/plain", message);
  Serial.println(message);
}

void setup() {
  Serial.begin(9600);

  dataIn = "";

  WiFi.mode(WIFI_AP_STA);
  WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));
  WiFi.softAP(ssid, password);
  SPIFFS.begin();
  IPAddress myIP = WiFi.softAPIP();
  server.on("/", handleRoot);
  server.on("/readADC", parsingData);
  server.onNotFound(handleWebRequests);
  server.begin();
}

bool loadFromSpiffs(String path) {
  String dataType = "text/plain";
  if (path.endsWith("/")) path += "index.htm";
  if (path.endsWith(".src")) path = path.substring(0, path.lastIndexOf("."));
  else if (path.endsWith(".html")) dataType = "text/html";
  else if (path.endsWith(".htm")) dataType = "text/html";
  else if (path.endsWith(".css")) dataType = "text/css";
  else if (path.endsWith(".js")) dataType = "application/javascript";
  else if (path.endsWith(".png")) dataType = "image/png";
  else if (path.endsWith(".gif")) dataType = "image/gif";
  else if (path.endsWith(".jpg")) dataType = "image/jpeg";
  else if (path.endsWith(".ico")) dataType = "image/x-icon";
  else if (path.endsWith(".xml")) dataType = "text/xml";
  else if (path.endsWith(".pdf")) dataType = "application/pdf";
  else if (path.endsWith(".zip")) dataType = "application/zip";
  File dataFile = SPIFFS.open(path.c_str(), "r");
  if (server.hasArg("download")) dataType = "application/octet-stream";
  if (server.streamFile(dataFile, dataType) != dataFile.size()) {
  }
  dataFile.close();
  return true;
}

void loop() {
  server.handleClient();
  if (Serial.available() > 0) {
    char inChar = (char)Serial.read();
    dataIn += inChar;
    if (inChar == '\n') {
      parsing = true;
    }
  }
  if (parsing) {
    parsingData();
    parsing = false;
    dataIn = "";
  }

}



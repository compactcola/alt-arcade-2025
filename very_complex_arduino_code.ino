const int xPin = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int xRaw = analogRead(xPin);
  Serial.println(xRaw);
  delay(200);
}

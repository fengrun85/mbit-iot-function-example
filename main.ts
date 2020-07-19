function ConnectWifi (YOUR_SSID: string, YOUR_PW: string) {
    while (ESP8266_IoT.wifiState(false)) {
        OLED.writeStringNewLine("Connecting to Wifi")
        ESP8266_IoT.connectWifi(YOUR_SSID, YOUR_PW)
        ESP8266_IoT.wait(5000)
    }
    OLED.writeStringNewLine("Wifi Connected")
    basic.showIcon(IconNames.Yes)
    basic.pause(1000)
    OLED.clear()
}
function DisplayBME280Readings (Temp: number, Humid: number, Press: number, Alt: number) {
    OLED.writeString("Temp : ")
    OLED.writeNum(Temp)
    OLED.writeStringNewLine("C")
    OLED.writeString("Humidity : ")
    OLED.writeNum(Humid)
    OLED.writeStringNewLine("%")
    OLED.writeString("Pressure : ")
    OLED.writeNum(Press)
    OLED.writeStringNewLine("hPa")
    OLED.writeString("Altitude : ")
    OLED.writeNum(Alt)
    OLED.writeStringNewLine("M")
}
function UpdateThingSpeak (WriteKey: string, Temp: number, Humid: number, Press: number, Alt: number) {
    OLED.writeStringNewLine("Connect TS")
    ESP8266_IoT.connectThingSpeak()
    ESP8266_IoT.setdata(
    WriteKey,
    Temp,
    Humid,
    Press,
    Alt,
    0,
    0,
    0,
    0
    )
    ESP8266_IoT.uploadData()
    OLED.writeStringNewLine("TS Update Done")
    basic.pause(5000)
    OLED.clear()
}
input.onButtonPressed(Button.A, function () {
    ConnectWifi(SSID, WifiPass)
})
input.onButtonPressed(Button.AB, function () {
    UpdateThingSpeak(TSWriteKey, Environment.octopus_BME280(Environment.BME280_state.BME280_temperature_C), Environment.octopus_BME280(Environment.BME280_state.BME280_humidity), Environment.octopus_BME280(Environment.BME280_state.BME280_pressure), Environment.octopus_BME280(Environment.BME280_state.BME280_altitude))
})
input.onButtonPressed(Button.B, function () {
    DisplayBME280Readings(Environment.octopus_BME280(Environment.BME280_state.BME280_temperature_C), Environment.octopus_BME280(Environment.BME280_state.BME280_humidity), Environment.octopus_BME280(Environment.BME280_state.BME280_pressure), Environment.octopus_BME280(Environment.BME280_state.BME280_altitude))
})
let TSWriteKey = ""
let WifiPass = ""
let SSID = ""
basic.showIcon(IconNames.Happy)
SSID = "YourSSID"
WifiPass = "YourPassword"
TSWriteKey = "YourWriteKey"
let UpdateIntervalInSec = 55
music.setVolume(45)
ESP8266_IoT.initWIFI(SerialPin.P8, SerialPin.P12, BaudRate.BaudRate115200)
OLED.init(128, 64)
basic.showIcon(IconNames.Pitchfork)
ConnectWifi(SSID, WifiPass)
music.playTone(262, music.beat(BeatFraction.Double))
basic.forever(function () {
    ConnectWifi(SSID, WifiPass)
    DisplayBME280Readings(Environment.octopus_BME280(Environment.BME280_state.BME280_temperature_C), Environment.octopus_BME280(Environment.BME280_state.BME280_humidity), Environment.octopus_BME280(Environment.BME280_state.BME280_pressure), Environment.octopus_BME280(Environment.BME280_state.BME280_altitude))
    UpdateThingSpeak(TSWriteKey, Environment.octopus_BME280(Environment.BME280_state.BME280_temperature_C), Environment.octopus_BME280(Environment.BME280_state.BME280_humidity), Environment.octopus_BME280(Environment.BME280_state.BME280_pressure), Environment.octopus_BME280(Environment.BME280_state.BME280_altitude))
    basic.pause(UpdateIntervalInSec * 1000)
})

'''
Sensehat Dashboard
=========================================
Author: The Great Nawang Tendar
Modified: 02-11-2019
-----------------------------------------
for Audio installation:
-----------------------------------------
    sudo apt install mpg123
=========================================
'''
# Import the libraries
from sense_hat import SenseHat
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from ast import literal_eval
import time
import json

import pygame
import os, sys

# Create an instance of the sensehat
sense = SenseHat()

    
# Fetch the service account key JSON file contents
cred = credentials.Certificate('./credentials.json')

# Initialize the app with a service account, granting admin privileges
firebase_admin.initialize_app(cred, {
    'databaseURL':'https://wot-domotica.firebaseio.com/'
})

ref = db.reference()

# read color from firebase
def showSettingOnSenseHat():
    
    # get color 
    # set sense color to that color
    # eazy pizzy
    charColor = literal_eval(ref.get()["homeSetting"])
    sense.set_pixels(charColor)


def updateEnvironmentData():
    environment = {
        'temperature': {
            'value': round(sense.get_temperature()),
            'unit': u'C'
        },
        'humidity': {
            'value': round(sense.get_humidity()),
            'unit': u'%'
        }
    }
    db.reference("environment").set(environment)
    
def initiateAlarm():
    x = [0, 0, 0]
    lOff = [133, 112, 31]
    lOn = [255, 215, 57]
    dOn = [0, 254, 0]
    oOff = [67,122,141]
    gridAlarmFrameOne = [
        x, x, lOff, x, x, lOff, x, x,
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
        oOff, x, x, x, x, x, x, oOff,
        x, x, lOff, x, x, lOff, x, x,
        dOn, x, x, x, x, x, x, dOn,
        dOn, x, x, x, x, x, x, dOn,
        dOn, x, x, oOff, oOff, x, x, dOn,
    ]
    
    gridAlarmFrameTwo = [
        x, x, lOn, x, x, lOn, x, x,
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
        oOff, x, x, x, x, x, x, oOff,
        x, x, lOn, x, x, lOn, x, x,
        dOn, x, x, x, x, x, x, dOn,
        dOn, x, x, x, x, x, x, dOn,
        dOn, x, x, oOff, oOff, x, x, dOn,
    ]
    
    sense.set_pixels(gridAlarmFrameOne)
    time.sleep(0.2)
    sense.set_pixels(gridAlarmFrameTwo)

        
while True:
	if ref.get()["alarm"]:
            updateEnvironmentData()
            initiateAlarm()
            
            #cant play sound in the background - it does play sound
            #os.system("mpg123 -q alarm.mp3")
            
        else:
            showSettingOnSenseHat()
            updateEnvironmentData()

    


    
    

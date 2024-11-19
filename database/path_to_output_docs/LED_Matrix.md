# ArduinoLEDMatrix API Documentation

## Overview

The `ArduinoLEDMatrix` class is used to control an LED matrix using an Arduino-compatible platform. This library allows you to turn on or off individual LEDs, play frames, load sequences, and handle drawing operations with optional support for ArduinoGraphics.

## Class: ArduinoLEDMatrix

### Inheritance

- Inherits from `ArduinoGraphics` if `ArduinoGraphics.h` is included.

### Constants

- `NUM_LEDS` (96): Total number of LEDs supported.
- `canvasWidth` (12): Width of the canvas (when using ArduinoGraphics).
- `canvasHeight` (8): Height of the canvas (when using ArduinoGraphics).

### Public Methods

#### Constructor

- `ArduinoLEDMatrix()`: Initializes the LED matrix; if ArduinoGraphics is included, it initializes the inherited `ArduinoGraphics` constructor with `canvasWidth` and `canvasHeight`.

#### LED Control

- `void on(size_t pin)`: Turns on the LED at the specified pin index.

- `void off(size_t pin)`: Turns off the LED at the specified pin index.

#### Sequence Control

- `int begin()`: Initializes and starts the LED timer for periodic operations. Returns an integer that indicates success (nonzero) or failure (zero).

- `void play(bool loop = false)`: Starts playing the loaded frame sequence. The optional parameter `loop` specifies whether the sequence should loop continuously.

- `bool sequenceDone()`: Checks if the current sequence has completed. Returns true if the sequence has completed, else returns false.

#### Frame Management

- `void loadFrame(const uint32_t buffer[3])`: Loads a single frame from the provided buffer containing 3 `uint32_t` values.

- `void loadPixels(uint8_t *arr, size_t size)`: Loads pixel data from an array. Takes a pointer to the array and the size of the array.

- `void renderFrame(uint8_t frameNumber)`: Renders the specified frame number.

- `void next()`: Advances to the next frame in the sequence.

- `void clear()`: Clears the current content of the frame buffer and optionally clears the canvas buffer (if ArduinoGraphics is included).

- `void setCallback(voidFuncPtr callBack)`: Sets a callback function to be called when the sequence ends.

- `void autoscroll(uint32_t interval_ms)`: Sets the LED matrix to autoscroll with the specified interval in milliseconds.

### Private Methods

- `static void turnLed(int idx, bool on)`: Turns a specific LED on or off based on the index and state provided.

- `static uint32_t reverse(uint32_t x)`: Reverses the bit order of a 32-bit integer.

- `void loadWrapper(const uint32_t frames[][4], uint32_t howMany)`: Internal wrapper for loading a sequence of frames.

- `static void turnOnLedISR(timer_callback_args_t *arg)`: Interrupt Service Routine (ISR) to handle LED updates; invoked periodically by the timer.

### Macros

- `loadSequence(frames)`: Loads a sequence of frames using `loadWrapper`.

- `renderBitmap(bitmap, rows, columns)`: Renders a bitmap onto the LED matrix.

### Usage

```cpp
ArduinoLEDMatrix ledMatrix;

void setup() {
    ledMatrix.begin();
    ledMatrix.autoscroll(100); // set autoscroll interval
    ledMatrix.on(10); // turn on LED at index 10
}

void loop() {
    if (ledMatrix.sequenceDone()) {
        ledMatrix.play(true); // restart sequence
    }
}
```

This documentation provides a comprehensive understanding of the available methods, constants, and usage patterns for `ArduinoLEDMatrix`. Adjust the sequence and LED control based on specific project needs and hardware configurations.
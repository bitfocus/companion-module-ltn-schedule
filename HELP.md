# LTN Schedule
LTN Schedule delivers simplified workflows for creating 24/7 linear programs from archived content and live elements, with ad management.


## Configuration

Setting | Description
-----------------|---------------
**Host** | Enter the hostname of your Schedule instance.
**API Username** | Enter the username of one of the Schedule instance's API Users.
**API Password** | Enter the corresponding password.


## Actions
Action | Description
-----------------|---------------
**Toggle playback running** | Starts/stops the playback without publishing (timestamp can be set like in the Schedule UI).
**Toggle publishing** | Starts/stops publishing if the playback is running.
**Toggle push targets** | Enables/disables push targets.
**Skip a playback element** | Jump to next item when the playback is running.
**Trigger an ad** | Triggers an ad of the desired length when system is pushing.


## Feedback available
Feedback | Description
-----------------|---------------
**Playout running status** | Shows whether the playback is running.
**Publish status** | Shows wheter the playback is not running/running/pushing.
**Targets publish status** | Shows if the selected push targets are disabled/enabled/pushing/error.
**Skippable status** | Shows if the skip action is possible, or on cooldown.
**Ad trigger status** | Shows if an ad can be triggered or if one is currently running.

## Presets

A preset for each pair of action/feedback is created.
A preset for each existing push target on the Schedule system are also created.

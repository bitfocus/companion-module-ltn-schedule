import {combineRgb} from '@companion-module/base'
import {
  lightBlue,
  lightBlueDisabled,
  darkGrey,
  lightGrey,
  green,
  red,
  black,
  yellow
} from '../index.js'

export function initPresets() {
  const presets = {}
  const pstSize = '18'
  const generalCommands = ['toggle_playback', 'toggle_publish', 'skip_element',
    'trigger_ad']
  const structure = [
    {
      id: 'section-commands',
      name: 'Commands',
      description: 'Use various commands for Schedule',
      definitions: [
        {
          id: 'general-commands',
          type: 'simple',
          name: 'General Commands',
          presets: generalCommands,
        },
      ],
    },
    {
      id: 'section-push-targets',
      name: 'Push Targets',
      description: 'Toggle push targets statuses',
      definitions: this.data.targets.map((t) => t.id),
    },
  ]

  const createJumpToPreset = (name, options) => (
      {
        type: 'simple',
        name: `Jump to ${name}`,
        options: {},
        style: {
          text: `Jump to ${name}`,
          size: pstSize,
          color: '16777215',
          bgcolor: darkGrey,
        },
        steps: [
          {
            down: [
              {
                actionId: 'jumpTo',
                options: options,
              },
            ],
            up: [],
          },
        ],
        feedbacks: [
          {
            feedbackId: 'flexiblePlaybackStatus',
            style: {
              bgcolor: green,
            },
            options: {},
          },
          {
            feedbackId: 'playedElementStatus',
            style: {
              bgcolor: red,
            },
            options: options,
          },
        ],
      }
  );

  this.data.targets
  .map((target) => {
    return {
      id: target.id,
      type: 'simple',
      name: target.label,
      options: {},
      style: {
        text: target.label,
        size: pstSize,
        color: '16777215',
        bgcolor: combineRgb(0, 0, 0),
      },
      steps: [
        {
          down: [
            {
              actionId: 'targets_toggle',
              options: {
                targetsSelect: [target.id],
              },
            },
          ],
          up: [],
        },
      ],
      feedbacks: [
        {
          feedbackId: 'targetsStatus',
          options: {
            targets: [target.id],
            fg: black,
            bgDisabled: darkGrey,
            bgEnabled: lightGrey,
            bgPushing: green,
            bgPushingProblem: red,
          },
        },
      ],
    }
  })
  .forEach((element) => {
    presets[element.id] = element
  })

  presets.toggle_playback = {
    type: 'simple',
    name: 'Toggle Playback',
    options: {},
    style: {
      text: 'Toggle playback',
      size: pstSize,
      color: '16777215',
      bgcolor: combineRgb(91, 198, 233),
    },
    steps: [
      {
        down: [
          {
            actionId: 'playback_toggle',
            options: {
              startstamp: 0,
            },
          },
        ],
        up: [],
      },
    ],
    feedbacks: [
      {
        feedbackId: 'playbackStatus',
        style: {
          bgcolor: combineRgb(231, 88, 59),
        },
        options: {},
      },
    ],
  }

  presets.toggle_publish = {
    type: 'simple',
    name: 'Toggle Publish',
    options: {},
    style: {
      text: 'Toggle publish',
      size: pstSize,
      color: '16777215',
      bgcolor: combineRgb(0, 0, 0),
    },
    steps: [
      {
        down: [
          {
            actionId: 'publish_toggle',
            options: {},
          },
        ],
        up: [],
      },
    ],
    feedbacks: [
      {
        feedbackId: 'publishStatus',
        options: {
          fg: black,
          bgDisabled: lightBlueDisabled,
          bgEnabled: lightBlue,
          bgPushing: red,
        },
      },
    ],
  }

  let skipFeedbacks = []

  skipFeedbacks.push({
    feedbackId: 'skippableStatus',
    options: {
      fg: black,
      bgDisabled: darkGrey,
      bgEnabled: lightBlue,
      bgSkipped: green,
    },
  })

  if (this.data.apiVersion >= 6) {
    skipFeedbacks.push({
      feedbackId: 'nextElementUnavailable',
      style: {
        bgcolor: red,
      },
      options: {},
    })
    skipFeedbacks.push({
      feedbackId: 'nextElementCaching',
      style: {
        bgcolor: yellow,
      },
      options: {},
    })
  }

  presets.skip_element = {
    type: 'simple',
    name: 'Skip element',
    options: {},
    style: {
      text: 'Skip element',
      size: pstSize,
      color: '16777215',
      bgcolor: combineRgb(0, 0, 0),
    },
    steps: [
      {
        down: [
          {
            actionId: 'playback_skip',
            options: {
              strategy: 'snap',
            },
          },
        ],
        up: [],
      },
    ],
    feedbacks: skipFeedbacks,
  }

  presets.trigger_ad = {
    type: 'simple',
    name: 'Trigger ad',
    options: {},
    style: {
      text: 'Ad break',
      size: pstSize,
      color: '16777215',
      bgcolor: combineRgb(0, 0, 0),
    },
    steps: [
      {
        down: [
          {
            actionId: 'playback_ad',
            options: {
              adLength: '30',
              triggerType: 'LOCAL'
            },
          },
        ],
        up: [],
      },
    ],
    feedbacks: [
      {
        feedbackId: 'adTriggerStatus',
        options: {
          fg: black,
          bgDisabled: darkGrey,
          bgEnabled: lightBlue,
          bgPushing: green,
        },
      },
    ],
  }

  let breakingNewsFeedbacks = []

  breakingNewsFeedbacks.push({
    feedbackId: 'playbackStatus',
    style: {
      bgcolor: lightBlue,
    },
    options: {},
  })

  breakingNewsFeedbacks.push({
    feedbackId: 'breakingNewsStatus',
    style: {
      bgcolor: red,
    },
    options: {},
  })

  if (this.data.apiVersion >= 7) {
    breakingNewsFeedbacks.push({
      feedbackId: 'breakingLiveBumperStatus',
      style: {
        bgcolor: yellow,
      },
      options: {},
    })
  }

  if (this.data.apiVersion > 1) {
    generalCommands.push('toggle_breaking_news')

    presets.toggle_breaking_news = {
      type: 'simple',
      name: 'Toggle Breaking News',
      options: {},
      style: {
        text: 'Toggle Breaking News',
        size: pstSize,
        color: '16777215',
        bgcolor: darkGrey,
      },
      steps: [
        {
          down: [
            {
              actionId: 'breaking_news',
              options: {
                livestreamSelect: 'select',
                skipOnStop: false,
              },
            },
          ],
          up: [],
        },
      ],
      feedbacks: breakingNewsFeedbacks,
    }
  }

  if (this.data.apiVersion > 3) {
    generalCommands.push('cancel_ad')

    presets.cancel_ad = {
      type: 'simple',
      name: 'Cancel ad',
      options: {},
      style: {
        text: 'Cancel ad',
        size: pstSize,
        color: '16777215',
        bgcolor: combineRgb(0, 0, 0),
      },
      steps: [
        {
          down: [
            {
              actionId: 'cancel_ad',
              options: {},
            },
          ],
          up: [],
        },
      ],
      feedbacks: [
        {
          feedbackId: 'adTriggerStatus',
          options: {
            fg: black,
            bgDisabled: darkGrey,
            bgEnabled: lightBlue,
            bgPushing: green,
          },
        },
      ],
    }
  }

  if (this.data.apiVersion >= 5) {
    generalCommands.push('toggle_overlay', 'toggle_html_overlay',
        'toggle_hold')

    presets.toggle_overlay = {
      type: 'simple',
      name: 'Toggle PNG Overlay',
      options: {},
      style: {
        text: 'Toggle PNG Overlay',
        size: pstSize,
        color: '16777215',
        bgcolor: lightBlueDisabled,
      },
      steps: [
        {
          down: [
            {
              actionId: 'toggle_overlay',
              options: {},
            },
          ],
          up: [],
        },
      ],
      feedbacks: [
        {
          feedbackId: 'overlayStatus',
          style: {
            bgcolor: lightBlue,
          },
          options: {},
        },
      ],
    }

    presets.toggle_html_overlay = {
      type: 'simple',
      name: 'Toggle HTML Overlay',
      options: {},
      style: {
        text: 'Toggle HTML Overlay',
        size: pstSize,
        color: '16777215',
        bgcolor: lightBlueDisabled,
      },
      steps: [
        {
          down: [
            {
              actionId: 'toggle_html_overlay',
              options: {},
            },
          ],
          up: [],
        },
      ],
      feedbacks: [
        {
          feedbackId: 'htmlOverlayStatus',
          style: {
            bgcolor: lightBlue,
          },
          options: {},
        },
      ],
    }

    presets.toggle_hold = {
      type: 'simple',
      name: 'Toggle hold property',
      options: {},
      style: {
        text: 'Toggle hold',
        size: pstSize,
        color: '16777215',
        bgcolor: combineRgb(0, 0, 0),
      },
      steps: [
        {
          down: [
            {
              actionId: 'toggle_hold',
              options: {},
            },
          ],
          up: [],
        },
      ],
      feedbacks: [
        {
          feedbackId: 'holdStatus',
          options: {
            fg: black,
            bgDisabled: darkGrey,
            bgRunningEnabled: lightBlue,
            bgRunningDisabled: lightBlueDisabled,
            bgHolding: green,
          },
        },
      ],
    }

    structure.push({
      id: 'section-breaking-live',
      name: 'Breaking Live',
      description: 'Start and stop specific breaking live streams',
      definitions: this.data.livestreams.map((element) => element.id),
    })

    this.data.livestreams
    .map((live) => {
      let liveFeedback = []

      liveFeedback.push({
        feedbackId: 'playbackStatus',
        style: {
          bgcolor: lightBlue,
        },
        options: {},
      })

      liveFeedback.push({
        feedbackId: 'breakingLiveLivestreamStatus',
        style: {
          bgcolor: red,
        },
        options: {
          livestreamSelect: live.id,
        },
      })

      if (this.data.apiVersion >= 7) {
        liveFeedback.push({
          feedbackId: 'breakingLiveBumperStatus',
          style: {
            bgcolor: yellow,
          },
          options: {},
        })
      }

      return {
        type: 'simple',
        name: `BL ${live.label}`,
        useId: live.id,
        options: {},
        style: {
          text: `BL ${live.label}`,
          size: pstSize,
          color: '16777215',
          bgcolor: darkGrey,
        },
        steps: [
          {
            down: [
              {
                actionId: 'breaking_news',
                options: {
                  livestreamSelect: live.id,
                },
              },
            ],
            up: [],
          },
        ],
        feedbacks: liveFeedback,
      }
    })
    .forEach((element) => {
      presets[element.useId] = element
    })
  }

  if (this.data.apiVersion >= 6) {
    structure.push({
      id: 'section-templates',
      name: 'Templates',
      definitions: ['insert_template'],
    })

    presets.insert_template = {
      type: 'simple',
      name: `Insert template`,
      options: {},
      style: {
        text: `Insert template`,
        size: pstSize,
        color: '16777215',
        bgcolor: green,
      },
      steps: [
        {
          down: [
            {
              actionId: 'insert_template',
              options: {
                templatesSelect: 'select',
                insertSelect: 'next',
                conflictSelect: 'nothing',
                skipOnReady: false,
              },
            },
          ],
          up: [],
        },
      ],
      feedbacks: [
        {
          feedbackId: 'templateInsertStatus',
          style: {
            bgcolor: yellow,
          },
          options: {
            insertStatus: '1',
          },
        },
        {
          feedbackId: 'templateInsertStatus',
          style: {
            bgcolor: red,
          },
          options: {
            insertStatus: '2',
          },
        },
      ],
    }
  }

  const timers = ['total_remaining_time', 'total_played_time',
    'current_remaining_time', 'total_duration', 'ad_remaining_time']
  if (this.data.apiVersion >= 7) {

    generalCommands.push('sync_status')

    presets.sync_status = {
      type: 'simple',
      name: `Sync status`,
      options: {},
      style: {
        text: `Sync`,
        size: pstSize,
        color: '16777215',
        bgcolor: darkGrey,
      },
      steps: [
        {
          down: [
            {
              actionId: 'resync',
              options: {},
            },
          ],
          up: [],
        },
      ],
      feedbacks: [
        {
          feedbackId: 'syncStatus',
          options: {
            fg: black,
            bgUninitialized: darkGrey,
            bgCatchingUp: yellow,
            bgSynced: green,
            bgError: red,
          },
        },
      ],
    }

    structure.push({
      id: 'section-timers',
      name: 'Timers',
      description: 'Playback-related timers',
      definitions: timers,
    })
    presets.total_remaining_time = {
      type: 'simple',
      name: `Total Remaining Time`,
      options: {},
      style: {
        text: `Remaining time\n$(generic-module:totalRemainingTime)`,
        size: 11,
        color: lightBlue,
        bgcolor: darkGrey,
      },
      steps: [
        {
          down: [],
          up: [],
        },
      ],
      feedbacks: [],
    }

    presets.total_played_time = {
      type: 'simple',
      name: `Total Played Time`,
      options: {},
      style: {
        text: `Played time\n$(generic-module:totalPlayedTime)`,
        size: 11,
        color: green,
        bgcolor: darkGrey,
      },
      steps: [
        {
          down: [],
          up: [],
        },
      ],
      feedbacks: [],
    }

    presets.current_remaining_time = {
      type: 'simple',
      name: `Current Remaining Time`,
      options: {},
      style: {
        text: `Element time\n$(generic-module:currentRemainingTime)`,
        size: 11,
        color: red,
        bgcolor: darkGrey,
      },
      steps: [
        {
          down: [],
          up: [],
        },
      ],
      feedbacks: [],
    }

    presets.total_duration = {
      type: 'simple',
      name: `Total Duration`,
      options: {},
      style: {
        text: `Total duration\n$(generic-module:totalDuration)`,
        size: 11,
        color: '16777215',
        bgcolor: darkGrey,
      },
      steps: [
        {
          down: [],
          up: [],
        },
      ],
      feedbacks: [],
    }

    presets.ad_remaining_time = {
      type: 'simple',
      name: `Ad break remaining time`,
      options: {},
      style: {
        text: `$(generic-module:adRemainingTime)`,
        size: pstSize,
        color: '16777215',
        bgcolor: darkGrey,
      },
      steps: [
        {
          down: [],
          up: [],
        },
      ],
      feedbacks: [
        {
          feedbackId: 'adTriggerStatus',
          options: {
            fg: black,
            bgDisabled: darkGrey,
            bgEnabled: lightBlue,
            bgPushing: green,
          },
        },
      ],
    }
  }

  if (this.data.apiVersion >= 8) {

    structure[0].definitions.push({
      id: 'jump',
      type: 'simple',
      name: 'Jump To',
      description: 'Presets for flexible playback',
      presets: ['jump_to_id', 'jump_to_index', 'jump_to_title',
        'jump_to_custom'],
    })

    generalCommands.push('toggle_scaling')

    presets.jump_to_id = createJumpToPreset('ID',
        {id: "id to fill", index: '0'})
    presets.jump_to_index = createJumpToPreset('Index', {index: '0'})
    presets.jump_to_title = createJumpToPreset('Title',
        {title: "title", index: '0'})
    presets.jump_to_custom = createJumpToPreset('Key', {
      customKey: "custom key",
      customValue: "custom value",
      index: '0'
    })

    presets.toggle_scaling = {
      type: 'simple',
      name: `Toggle output scaling`,
      options: {},
      style: {
        text: `Toggle scaling`,
        size: pstSize,
        color: '16777215',
        bgcolor: red,
      },
      steps: [
        {
          down: [{
            actionId: 'scaling',
            options: {},
          }],
          up: [],
        },
      ],
      feedbacks: [
        {
          feedbackId: 'outputScalingStatus',
          style: {
            bgcolor: green,
          },
          options: {},
        }
      ],
    }
  }

  if (this.data.apiVersion >= 9) {
    this.data.graphicsRundown
    .map((element) => {
      return {
        id: element.id,
        type: 'simple',
        name: element.label,
        options: {},
        style: {
          text: element.label,
          size: pstSize,
          color: '16777215',
          bgcolor: combineRgb(0, 0, 0),
        },
        steps: [
          {
            down: [
              {
                actionId: 'setGraphicsLayer',
                options: {
                  rundownElement: [element.id],
                  status: 'toggle'
                },
              },
            ],
            up: [],
          },
        ],
        feedbacks: [
          {
            feedbackId: 'graphicsStatus',
            style: {
              bgcolor: red,
            },
            options: {
              graphicsRundownSelect: element.id
            },
          },
        ],
      }
    })
    .forEach((element) => {
      presets["graphics-rundown-" + element.id] = element
    })
    structure.push({
      id: 'section-graphics',
      name: 'Graphics',
      description: 'Toggle graphics engine layers',
      definitions: this.data.graphicsRundown.map(
          (element) => "graphics-rundown-" + element.id),
    })
  }

  if (this.data.apiVersion >= 10) {
    timers.push('current_played_time')
    presets.current_played_time = {
      type: 'simple',
      name: `Current Element Played Time`,
      options: {},
      style: {
        text: `Current played time\n$(generic-module:currentPlayedTime)`,
        size: 11,
        color: red,
        bgcolor: darkGrey,
      },
      steps: [
        {
          down: [],
          up: [],
        },
      ],
      feedbacks: [],
    }
  }

  if (this.data.apiVersion >= 11) {
    presets.toggle_pgm_recording = {
      type: 'simple',
      name: `Toggle PGM Recording`,
      options: {},
      style: {
        text: `PGM Recording runtime\n$(generic-module:currentPgmRecordingTime)`,
        size: 11,
        color: '16777215',
        bgcolor: darkGrey,
      },
      steps: [
        {
          down: [
            {
              actionId: 'setPGMRecording',
              options: {
                status: 'toggle'
              },
            },
          ],
          up: [],
        },
      ],
      feedbacks: [
        {
          feedbackId: 'pgmRecordingStatus',
          style: {
            bgcolor: red,
          },
        },
      ],
    }

    presets.stop_pgm_recording = {
      type: 'simple',
      name: `Stop PGM Recording`,
      options: {},
      style: {
        text: `Stop PGM Recording`,
        size: 11,
        color: '16777215',
        bgcolor: darkGrey,
      },
      steps: [
        {
          down: [
            {
              actionId: 'setPGMRecording',
              options: {
                status: 'stop'
              },
            },
          ],
          up: [],
        },
      ],
      feedbacks: [],
    }

    presets.start_pgm_recording = {
      type: 'simple',
      name: `Start PGM Recording`,
      options: {},
      style: {
        text: `Start PGM Recording`,
        size: 11,
        color: '16777215',
        bgcolor: darkGrey,
      },
      steps: [
        {
          down: [
            {
              actionId: 'setPGMRecording',
              options: {
                status: 'start'
              },
            },
          ],
          up: [],
        },
      ],
      feedbacks: [],
    }

    structure.push({
      id: 'section-recording',
      name: 'Recording',
      description: 'Start and stop recordings in Schedule',
      definitions: ['toggle_pgm_recording', 'start_pgm_recording', 'stop_pgm_recording'],
    })
  }

  this.setPresetDefinitions(structure, presets)
}


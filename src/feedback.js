import { combineRgb } from '@companion-module/base'
import { lightBlue, lightBlueDisabled, darkGrey, lightGrey, green, red, black } from '../index.js'

export function initFeedbacks() {
	const feedbacks = {}

	const targets = {
		type: 'multidropdown',
		multiple: true,
		label: 'Push Targets',
		id: 'targets',
		default: 'select',
		choices: this.data.targets.concat({ id: 'select', label: 'Select a target' }),
	}

	const foregroundColor = {
		type: 'colorpicker',
		label: 'Foreground color',
		id: 'fg',
		default: black,
	}

	feedbacks.playbackStatus = {
		type: 'boolean',
		name: 'Playout running status',
		description: 'Indicates if the playout is running',
		defaultStyle: {
			bgcolor: red,
		},
		options: [],
		callback: ({ options }) => {
			if (this.data.playoutRunning) {
				return true
			}
		},
	}

	if (this.data.apiVersion > 1) {
		feedbacks.breakingNewsStatus = {
			type: 'boolean',
			name: 'Breaking news running status',
			description: 'Indicates if the breaking news are displayed',
			defaultStyle: {
				bgcolor: red,
			},
			options: [],
			callback: ({ options }) => {
				if (this.data.breakingNewsRunning) {
					return true
				}
			},
		}
	}

	feedbacks.targetsStatus = {
		type: 'advanced',
		name: 'Targets publish status',
		description: 'Indicate if all the selected targets are published',
		options: [
			targets,
			foregroundColor,
			{
				type: 'colorpicker',
				label: 'Targets disabled',
				id: 'bgDisabled',
				default: darkGrey,
			},
			{
				type: 'colorpicker',
				label: 'Targets enabled',
				id: 'bgEnabled',
				default: lightGrey,
			},
			{
				type: 'colorpicker',
				label: 'Targets pushing',
				id: 'bgPushing',
				default: green,
			},
			{
				type: 'colorpicker',
				label: 'Targets pushing with problem',
				id: 'bgPushingProblem',
				default: red,
			},
		],
		callback: ({ options }) => {
			var actualSelectedTargets = options.targets.filter((target) => target !== 'select')
			var someDisabled = this.data.targets
				.filter((target) => actualSelectedTargets.some((selected) => selected === target.id))
				.some((target) => !target.enabled)
			var someProblem = this.data.targets
				.filter((target) => actualSelectedTargets.some((selected) => selected === target.id))
				.some((target) => target.status != 2)

			if (actualSelectedTargets.length === 0) {
				return { color: options.fg, bgcolor: options.bgDisabled }
			} else if (this.data.publishRunning) {
				if (someDisabled) {
					return { color: options.fg, bgcolor: options.bgDisabled }
				} else if (someProblem) {
					return { color: options.fg, bgcolor: options.bgPushingProblem }
				} else {
					return { color: options.fg, bgcolor: options.bgPushing }
				}
			} else {
				if (someDisabled) {
					return { color: options.fg, bgcolor: options.bgDisabled }
				} else {
					return { color: options.fg, bgcolor: options.bgEnabled }
				}
			}
		},
	}

	feedbacks.publishStatus = {
		type: 'advanced',
		name: 'Publish status',
		description: 'Indicate if the Schedule instance is currently publishing',
		options: [
			foregroundColor,
			{
				type: 'colorpicker',
				label: 'Playback not running',
				id: 'bgDisabled',
				default: lightBlueDisabled,
			},
			{
				type: 'colorpicker',
				label: 'Playback running, publish possible',
				id: 'bgEnabled',
				default: lightBlue,
			},
			{
				type: 'colorpicker',
				label: 'Publish running',
				id: 'bgPushing',
				default: red,
			},
		],
		callback: ({ options }) => {
			if (this.data.playoutRunning && this.data.publishRunning) {
				return { color: options.fg, bgcolor: options.bgPushing }
			} else if (this.data.playoutRunning) {
				return { color: options.fg, bgcolor: options.bgEnabled }
			} else {
				return { color: options.fg, bgcolor: options.bgDisabled }
			}
		},
	}

	feedbacks.skippableStatus = {
		type: 'advanced',
		name: 'Skippable status',
		description: 'Indicate if a skip is possible',
		options: [
			foregroundColor,
			{
				type: 'colorpicker',
				label: 'Not skippable',
				id: 'bgDisabled',
				default: darkGrey,
			},
			{
				type: 'colorpicker',
				label: 'Skippable',
				id: 'bgEnabled',
				default: lightBlue,
			},
			{
				type: 'colorpicker',
				label: 'Skipped, cooldown',
				id: 'bgSkipped',
				default: green,
			},
		],
		callback: ({ options }) => {
			if (this.data.skipUsed) {
				return { color: options.fg, bgcolor: options.bgSkipped }
			} else if (!this.data.playoutRunning) {
				return { color: options.fg, bgcolor: options.bgDisabled }
			} else {
				return { color: options.fg, bgcolor: options.bgEnabled }
			}
		},
	}

	feedbacks.adTriggerStatus = {
		type: 'advanced',
		name: 'Ad trigger status',
		description: 'Indicate if an ad is or can be triggered',
		options: [
			foregroundColor,
			{
				type: 'colorpicker',
				label: 'Triggering an ad is not possible',
				id: 'bgDisabled',
				default: darkGrey,
			},
			{
				type: 'colorpicker',
				label: 'Triggering an ad is possible',
				id: 'bgEnabled',
				default: lightBlue,
			},
			{
				type: 'colorpicker',
				label: 'Ad is currently playing',
				id: 'bgPushing',
				default: green,
			},
		],
		callback: ({ options }) => {
			if (this.data.adRunning != 0) {
				return { color: options.fg, bgcolor: options.bgPushing }
			} else if (
				(this.data.currentItemType === 'livestream' || this.data.breakingNewsRunning || this.data.apiVersion > 3) &&
				this.data.publishRunning
			) {
				return { color: options.fg, bgcolor: options.bgEnabled }
			} else {
				return { color: options.fg, bgcolor: options.bgDisabled }
			}
		},
	}
	return feedbacks
}

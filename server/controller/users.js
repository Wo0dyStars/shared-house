const User = require('../models/User');
const House = require('../models/House');

exports.getUserEmails = (req, res, next) => {
	User.find({}, 'email -_id').lean().then((emails) => {
		const userEmails = [];
		for (email of emails) {
			userEmails.push(email.email);
		}

		return res.status(200).json({
			emails: userEmails
		});
	});
};

exports.getUsers = (req, res, next) => {
	House.findById(req.userHouse)
		.populate('userIDs')
		.then((house) => {
			if (!house) {
				return res.status(400).json({
					message: 'An error occurred while fetching your house data.'
				});
			}

			res.status(200).json({
				message: 'You have successfully fetched all users for your house.',
				housename: house.name,
				users: house.userIDs
			});
		})
		.catch((error) => {
			return res.status(500).json({
				message: error.message
			});
		});
};

exports.editProfile = (req, res, next) => {
	const updateData = {};
	updateData[req.body.element] = req.body.value;
	updateData['lastUpdated'] = new Date();
	User.findByIdAndUpdate(req.params.id, updateData)
		.then((user) => {
			if (!user) {
				return res.status(401).json({
					message: 'The provided user ID does not exist in the database.'
				});
			}

			return res.status(200).json({
				message: `You have successfully updated the "${req.body.element}" field to "${req.body.value}".`,
				modifiedDate: updateData.lastUpdated
			});
		})
		.catch((error) => {
			return res.status(500).json({
				message: error.message
			});
		});
};

exports.getUserByID = (req, res, next) => {
	if (!req.params.id) {
		return res.status(400).json({
			message: 'The system was unable to find the user with this user ID.'
		});
	}

	User.findById(req.params.id)
		.then((user) => {
			if (!user) {
				return res.status(400).json({
					message: 'The system was unable to find the user with this user ID.'
				});
			}
			return res.status(200).json({
				forename: user.forename,
				surname: user.surname,
				age: user.age,
				occupation: user.occupation,
				phone: user.phone,
				avatar: user.avatar,
				_id: user._id,
				email: user.email,
				password: user.password,
				movedIn: user.movedIn,
				lastUpdated: user.lastUpdated,
				isVerified: user.isVerified,
				birthday: user.birthday,
				address: user.address,
				town: user.town,
				country: user.country,
				postcode: user.postcode,
				houseID: user.houseID
			});
		})
		.catch((error) => {
			return res.status(500).json({
				message: error.message
			});
		});
};

exports.findAddress = async (req, res, next) => {
	const postcode = req.body.postcodeValue.trim().replace(/\s/g, '').toLowerCase();
	const houseNumber = req.body.addressValue.replace(/\D/g, '');

	const userMatches = await User.find({})
		.populate('houseID')
		.then((users) => {
			let matched = [];
			users.forEach((user) => {
				if (
					user.postcode.trim().replace(/\s/g, '').toLowerCase() === postcode &&
					user.address.replace(/\D/g, '') === houseNumber
				) {
					matched.push(user);
				}
			});
			return matched;
		})
		.catch((error) => {
			return res.status(500).json({
				message: error.message
			});
		});

	matches = [];
	userMatches.forEach((user) => {
		let match = {
			forename: user.forename,
			surname: user.surname,
			email: user.email,
			houseID: user.houseID
		};

		matches.push(match);
	});

	if (matches.length) {
		return res.status(200).json({
			message: 'You have successfully obtained the list of users.',
			matches: matches
		});
	} else {
		return res.status(400).json({
			message: 'The system was unable to find any house with the provided details.'
		});
	}
};

exports.createHouse = (req, res, next) => {
	House.find({ userIDs: req.params.id })
		.then((houseExist) => {
			if (houseExist.length) {
				return res.status(400).json({
					message: 'You are already a member of one house.'
				});
			} else {
				const house = new House({
					name: req.body.housename,
					userIDs: [ req.params.id ]
				});

				house
					.save()
					.then((result) => {
						User.findByIdAndUpdate(req.params.id, { houseID: house._id })
							.then(() => {
								return res.status(200).json({
									message: `You have successfully created your house with name ${result.name}.`
								});
							})
							.catch((error) => {
								return res.status(500).json({
									message: error.message
								});
							});
					})
					.catch((error) => {
						return res.status(500).json({
							message: error.message
						});
					});
			}
		})
		.catch((error) => {
			return res.status(500).json({
				message: error.message
			});
		});
};

exports.joinHouse = (req, res, next) => {
	User.findById(req.params.userID)
		.then((user) => {
			if (!user) {
				return res.status(400).json({
					message: 'The system was unable to find any user with the provided user ID.'
				});
			}

			House.findById(req.params.houseID)
				.then((house) => {
					if (!house) {
						return res.status(400).json({
							message: 'There is no house with the provided house ID in the database.'
						});
					}

					if (house.userIDs.includes(req.params.userID)) {
						return res.status(400).json({
							message: 'You have already joined this house.'
						});
					} else {
						house.userIDs.push(req.params.userID);
						house
							.save()
							.then(() => {
								// FIND A USER ADDRESS DETAILS

								User.findById(house.userIDs[0]).then((userDetails) => {
									user.address = userDetails.address;
									user.town = userDetails.town;
									user.country = userDetails.country;
									user.postcode = userDetails.postcode;
									user.houseID = userDetails.houseID;

									user
										.save()
										.then(() => {
											return res.status(200).json({
												message: `You have successfully joined ${house.name}`
											});
										})
										.catch((error) => {
											return res.status(400).json({
												message: error.message
											});
										});
								});
							})
							.catch((error) => {
								return res.status(400).json({
									message: error.message
								});
							});
					}
				})
				.catch((error) => {
					return res.status(400).json({
						message: error.message
					});
				});
		})
		.catch((error) => {
			return res.status(400).json({
				message: error.message
			});
		});
};

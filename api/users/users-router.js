const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('./users-model');
const restrict = require('../../middleware/restrict');

const router = express.Router();

// Retrieve all users
router.get('/', restrict(0), async (req, res, next) => {
	try {
		const users  = await Users.findAll();
		res.json(users);
	} catch (err) {
		next(err);
	}
})

// Retrieves an user with the specified id
router.get('/:id', async (req, res, next) => {
	try {
		const user  = await Users.findById(req.params.id);
		res.json(user);
	} catch (err) {
		next(err);
	}
});

// Retrieves users with the specified role
router.get('/roles/:role_id', async (req, res, next) => {
	try {
		const users  = await Users.findByRole(req.params.role_id);
		res.json(users);
	} catch (err) {
		next(err);
	}
})

// Creates a new user in the database
router.post('/register', async (req, res, next) => {
	try {
		const { first_name, last_name, email, username, password, role_id } = req.body;
		const user = await Users.findBy({ username }).first();

		if (user) {
			return res.status(409).json({
				message: 'Username is already taken',
			});
		}

		const newUser = await Users.add({
			first_name,
			last_name,
			email,
			username,
			password: await bcrypt.hash(password, 14),
			role_id
		})

		res.status(201).json(newUser);
	} catch(err) {
		next(err);
	}
})

// Creates a login session for a user
router.post('/login', async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = await Users.findBy({ username }).first();

		if (!user) {
			return res.status(401).json({
				message: 'You shall not pass!',
			});
		}

		const passwordValid = await bcrypt.compare(password, user.password);

		if (!passwordValid) {
			return res.status(401).json({
				message: 'You shall not pass!',
			});
		}

		const payload = {
			id: user.id,
			username: user.username,
			role_id: user.role_id,
		}

		res.cookie('token', jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h'}));

		res.json({
			message: `Welcome ${user.username}!`,
		});
	} catch(err) {
		next(err);
	}
})

// Updates a current user with the specified id
router.put('/:id', async (req, res, next) => {
	try {
		const user = await Users.update(req.params.id, req.body);
		res.json(user);
	} catch (err) {
		next(err);
	}
});


// Deletes an user and returns the updated list of users
router.delete('/:id', async (req, res, next) => {
	try {
		await Users.remove(req.params.id);
		const users  = await Users.findAll();
		res.json(users);
	} catch (err) {
		next(err)
	}
})

// Logs user out
router.get('/logout', async (req, res, next) => {
	try {
		res.clearCookie('token');
		res.send('You have successfully logged out!');
	} catch (err) {
		next(err);
	}
})



module.exports = router;
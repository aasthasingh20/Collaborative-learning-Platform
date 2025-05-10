const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Group = require('../models/Group');
const User = require('../models/User');

// @route    POST api/v1/groups
// @desc     Create a group
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Group name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newGroup = new Group({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        creator: req.user.id,
        members: [req.user.id]
      });

      const group = await newGroup.save();

      res.json(group);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/v1/groups
// @desc     Get all groups
// @access   Public
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find().sort({ createdAt: -1 });
    res.json(groups);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/v1/groups/:id
// @desc     Get group by ID
// @access   Public
router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('creator', 'name avatar')
      .populate('members', 'name avatar');

    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }

    res.json(group);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Group not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/v1/groups/:id/join
// @desc     Join a group
// @access   Private
router.put('/:id/join', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }

    // Check if user is already a member
    if (group.members.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Already a member of this group' });
    }

    group.members.push(req.user.id);
    await group.save();

    res.json(group.members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/v1/groups/:id/leave
// @desc     Leave a group
// @access   Private
router.put('/:id/leave', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }

    // Check if user is a member
    if (!group.members.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Not a member of this group' });
    }

    // Remove user from members array
    group.members = group.members.filter(
      member => member.toString() !== req.user.id.toString()
    );

    await group.save();

    res.json(group.members);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/v1/groups/:id
// @desc     Delete a group
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }

    // Check user is creator
    if (group.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await group.remove();

    res.json({ msg: 'Group removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Group not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Resource = require('../models/Resource');
const Group = require('../models/Group');

// @route    POST api/v1/resources
// @desc     Create a resource
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('type', 'Type is required').not().isEmpty(),
      check('url', 'URL is required').not().isEmpty(),
      check('group', 'Group ID is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const group = await Group.findById(req.body.group);

      if (!group) {
        return res.status(404).json({ msg: 'Group not found' });
      }

      // Check if user is a member of the group
      if (!group.members.includes(req.user.id)) {
        return res.status(401).json({ msg: 'Not authorized to add resources to this group' });
      }

      const newResource = new Resource({
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        url: req.body.url,
        group: req.body.group,
        user: req.user.id
      });

      const resource = await newResource.save();

      res.json(resource);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/v1/resources/group/:groupId
// @desc     Get all resources for a group
// @access   Private
router.get('/group/:groupId', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }

    // Check if user is a member of the group
    if (!group.members.includes(req.user.id)) {
      return res.status(401).json({ msg: 'Not authorized to view resources for this group' });
    }

    const resources = await Resource.find({ group: req.params.groupId })
      .sort({ createdAt: -1 })
      .populate('user', 'name avatar');

    res.json(resources);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/v1/resources/:id
// @desc     Delete a resource
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ msg: 'Resource not found' });
    }

    // Check user is creator or admin
    if (resource.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await resource.remove();

    res.json({ msg: 'Resource removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Resource not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
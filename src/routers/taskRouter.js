const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/task");

router.post("/tasks", bodyParser.json(), auth, async (req, res) => {
    // const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id,
    });
    try {
        await task.save();
        res.status(201).send(task);
    } catch (err) {
        res.status(400).send(err);
    }
});

//GET /tasks?completed=false
// Get /tasks?limit=10?skip=10 -> skip first 10 results, limit number of results shown to 10
//Get /tasks?sortBy=createdAt_asc (or desc)
router.get("/tasks", bodyParser.json(), auth, async (req, res) => {
    const match = {
        owner: req.user._id,
    };
    const sort = {};

    if (req.query.completed) match.completed = req.query.completed === "true";

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split("_");
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    try {
        const tasks = await Task.find(match)
            .limit(parseInt(req.query.limit))
            .skip(parseInt(req.query.skip))
            .sort(sort);
        // await req.user.populate("tasks").execPopulate();
        res.send(tasks);
    } catch (err) {
        res.status(500).send();
    }
});

router.get("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id,
        });
        if (!task) return res.status(404).send();
        res.send(task);
    } catch (err) {
        res.status(500).send();
    }
});

router.patch("/tasks/:id", bodyParser.json(), auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );

    if (!isValidOperation)
        return res.status(400).send({ error: "Invalid Updates" });

    try {
        // const task = await Task.findById(req.params.id);
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id,
        });
        if (!task) return res.status(404).send;

        updates.forEach((update) => (task[update] = req.body[update]));

        await task.save();
        res.send(task);
    } catch (e) {
        res.status(400).send();
    }
});

router.delete("/tasks/:id", bodyParser.json(), auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id,
        });
        if (!task) return res.status(404).send();
        res.send(task);
    } catch (err) {
        res.status(500).send();
    }
});

module.exports = router;

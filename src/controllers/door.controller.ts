// pkgs:
import mongoose from 'mongoose';

// utils:
import Door from '../models/thing.model';

// door CRUD controllers: searchInAllDoors
//
// >>>> read
// READ ALL:
export const getDoors = async (req: any, res: any): Promise<void> => {
    const { page } = req.query;
    // if (!userId) res.status(401).json({ message: `Unauthenticated!!` })

    try {
        const LIMIT = 6;
        // get the starting index of every page
        const startIndex = (Number(page) - 1) * LIMIT;
        const total = await Door.countDocuments({});

        const doors = await Door.find()
            .sort({ _id: -1 })
            .limit(LIMIT)
            .skip(startIndex);

        res.json({
            doors,
            currentPage: Number(page),
            pagesCount: Math.ceil(total / LIMIT),
        });
    } catch (err) {
        res.status(404).json({
            message: `Could not find any doors.`,
            error: err,
        });
    }
};

// >>>> create
export const createNewDoor = async (req: any, res: any): Promise<void> => {
    // if (!req.userId) res.status(401).json({ message: `Unauthenticated!!` })

    const doorToCreate = req.body;
    const newDoor = new Door({
        ...doorToCreate,
    });

    try {
        await newDoor.save();

        res.status(201).json(newDoor);
    } catch (err) {
        res.status(409).json({
            message: `Something went wrong while creating new door, Please try again later.`,
            error: err,
        });
    }
};

// >>>> delete
export const deleteDoor = async (req: any, res: any): Promise<void> => {
    const { id: _id } = req.params;

    // if (!req.userId) res.status(401).json({ message: `Unauthenticated!!` })
    try {
        if (!mongoose.Types.ObjectId.isValid(_id))
            res.status(404).json({
                message: `There is no door with provided ID: ${_id}`,
            });

        await Door.findByIdAndRemove(_id);
        res.status(200).json({ message: 'Door has been deleted successfully' });
    } catch (err) {
        res.status(400).json({
            message: 'Failed to delete the door',
            error: err,
        });
    }
};

// >>>> update
export const updateDoor = async (req: any, res: any): Promise<void> => {
    // if (!req.userId) res.status(401).json({ message: `Unauthenticated!!` })

    const { id: _id } = req.params;
    const doorToUpdate = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(_id))
            res.status(404).json({
                message: `There's no door with ID: ${_id}`,
            });

        const updatedDoor = await Door.findByIdAndUpdate(
            _id,
            { ...doorToUpdate, _id },
            { new: true } // to return a new version
        );

        res.json(updatedDoor);
    } catch (err) {
        res.status(400).json({
            message: 'Failed to update the door',
            error: err,
        });
    }
};

// get certain one:
export const getSingleDoor = async (req: any, res: any): Promise<void> => {
    // const { userId } = req
    const { id: _id } = req.params;

    // if (!userId) res.status(401).json({ message: `Unauthenticated!!` })

    try {
        // should give it valid `id`, otherwise gonna through an error
        const sDoor = await Door.findById(_id);

        res.status(200).json(sDoor);
    } catch (err) {
        res.status(404).json({
            message: `Could not find door with ID: ${_id}`,
        });
    }
};

// door SEARCH controllers:
// // >>>> in all doors:
// export const searchInAllDoors = async (req:any, res:any): Promise<void> => {
//     // const { userId } = req
//     const { searchQuery, tags } = req.query
//
//     // if (!userId) res.status(401).json({ message: `Unauthenticated!!` })
//
//     // convert the searchQuery with regEx
//     const title = new RegExp(searchQuery.trim(), 'i')
//
//     try {
//         // retrieve the matched doors
//         const doors = await Door.find({
//             $or: [{ title }, { tags: { $in: tags.split(',') } }],
//         })
//
//         // retrieve only the doors that belongs to the logged user
//         res.status(200).json(doors)
//     } catch (error) {
//         res.status(400).json({
//             message: `Something went wrong ${error.message}`,
//         })
//     }
// }

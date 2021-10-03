// pkgs:
import { Request, Response } from 'express';
import mongoose from 'mongoose';

// utils:
import Tour from '../models/tour.model';

// Tour CRUD controllers: searchInAllTours
//
// >>>> read
// READ ALL:
export const getTours = async (req: Request, res: Response): Promise<void> => {
    const { page } = req.query;
    // if (!userId) res.status(401).json({ message: `Unauthenticated!!` })

    try {
        const LIMIT = 6;
        // get the starting index of every page
        const startIndex = (Number(page) - 1) * LIMIT;
        const total = await Tour.countDocuments({});

        const Tours = await Tour.find()
            .sort({ _id: -1 })
            .limit(LIMIT)
            .skip(startIndex);

        res.json({
            Tours,
            currentPage: Number(page),
            pagesCount: Math.ceil(total / LIMIT),
        });
    } catch (err) {
        res.status(404).json({
            message: `Could not find any tours.`,
            error: err,
        });
    }
};

// >>>> create
export const createNewTour = async (
    req: Request,
    res: Response
): Promise<void> => {
    const TourToCreate = req.body;
    const newTour = new Tour({
        ...TourToCreate,
    });

    try {
        await newTour.save();

        res.status(201).json(newTour);
    } catch (err) {
        res.status(409).json({
            message: `Something went wrong while creating new Tour, Please try again later.`,
            error: err,
        });
    }
};

// >>>> delete
export const deleteTour = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { id: _id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(_id))
            res.status(404).json({
                message: `There is no Tour with provided ID: ${_id}`,
            });

        await Tour.findByIdAndRemove(_id);
        res.status(200).json({ message: 'Tour has been deleted successfully' });
    } catch (err) {
        res.status(400).json({
            message: 'Failed to delete the Tour',
            error: err,
        });
    }
};

// >>>> update
export const updateTour = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { id: _id } = req.params;
    const TourToUpdate = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(_id))
            res.status(404).json({
                message: `There's no tours with ID: ${_id}`,
            });

        const updatedTour = await Tour.findByIdAndUpdate(
            _id,
            { ...TourToUpdate, _id },
            { new: true } // to return a new version
        );

        res.json(updatedTour);
    } catch (err) {
        res.status(400).json({
            message: 'Failed to update the Tour',
            error: err,
        });
    }
};

// get certain one:
export const getSingleTour = async (
    req: Request,
    res: Response
): Promise<void> => {
    // const { userId } = req
    const { id: _id } = req.params;

    // if (!userId) res.status(401).json({ message: `Unauthenticated!!` })

    try {
        // should give it valid `id`, otherwise gonna through an error
        const sTour = await Tour.findById(_id);

        res.status(200).json(sTour);
    } catch (err) {
        res.status(404).json({
            message: `Could not find tour with ID: ${_id}`,
        });
    }
};

// Tour SEARCH controllers:
// // >>>> in all tours:
// export const searchInAllTours = async (req:any, res:any): Promise<void> => {
//     // const { userId } = req
//     const { searchQuery, tags } = req.query
//
//     // if (!userId) res.status(401).json({ message: `Unauthenticated!!` })
//
//     // convert the searchQuery with regEx
//     const title = new RegExp(searchQuery.trim(), 'i')
//
//     try {
//         // retrieve the matched tours
//         const tours = await Tour.find({
//             $or: [{ title }, { tags: { $in: tags.split(',') } }],
//         })
//
//         // retrieve only the tours that belongs to the logged user
//         res.status(200).json(tours)
//     } catch (error) {
//         res.status(400).json({
//             message: `Something went wrong ${error.message}`,
//         })
//     }
// }

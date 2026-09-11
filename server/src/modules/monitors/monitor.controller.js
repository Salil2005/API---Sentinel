import {Monitor} from "./monitor.model.js" 

export const createMonitor = async (req, res, next) => {
    try{
        const monitorData = req.validated.body;

        const monitor = await Monitor.create({
            ...monitorData,
            userId: req.user.id,
        });

        return res.status(201).json({
            success: true,
            data: {
                monitor,
            },
        });
    }
    catch(error){
        next(error);
    }
};

export const getMonitors = async (req, res, next) => {
    try{
        const monitors = await Monitor.find({
            userId: req.user.id,
        }).sort({createdAt: -1});

        return res.status(200).json({
            success: true,
            data: {
                monitors,
            }
        });
    }
    catch(error){
        next(error);
    }
};

export const getMonitor = async (req, res, next) => {
    try{
        const monitor = await Monitor.findOne({
            _id: req.validated.params.id,
            userId: req.user.id,
        });

        if(!monitor){
            return res.status(404).json({
                success: false,
                error: "Monitor not found",
                code: 404,
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                monitor,
            },
        });
    }
    catch(error){
        next(error);
    }
};


export const updateMonitor = async (req, res, next) => {
    try{
        const monitor = await Monitor.findOneAndUpdate({
            _id: req.validated.params.id,
            userId: req.user.id,
        },
        {
            $set: req.validated.body,
        },
        {
            returnDocument: "after",
            runValidators: true,
        });

        if(!monitor){
            return res.status(404).json({
                success: false,
                error: "Monitor not found",
                code: 404,
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                monitor,
            },
        });
    }
    catch(error){
        next(error);
    }
};


export const deleteMonitor = async (req, res, next) => {
    try{
        const monitor = await Monitor.findOneAndDelete({
            _id: req.validated.params.id,
            userId: req.user.id,
        });

        if(!monitor){
            return res.status(404).json({
                success: false,
                error: "Monitor not found",
                code: 404,
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                message: "Monitor deleted successfully",
            },
        });
    }
    catch(error){
        next(error);
    }
}


export const pauseMonitor = async (req, res, next) => {
    try{
        const monitor = await Monitor.findOneAndUpdate({
            _id: req.validated.params.id,
            userId: req.user.id,
        },
        {
            $set: {
                active: false,
                status: "PAUSED",
            },
        },
        {
            returnDocument: "after",
            runValidators: true,
        });

        if(!monitor){
            return res.status(404).json({
                success: false,
                error: "Monitor not found",
                code: 404,
            });
        }

        return res.status(200).json({
            success: true,
            data:{
                monitor,
            }
        });
    }
    catch(error){
        next(error);
    }
};

export const resumeMonitor = async (req, res, next) => {
  try {
    const monitor = await Monitor.findOneAndUpdate(
      {
        _id: req.validated.params.id,
        userId: req.user.id,
      },
      {
        $set: {
          active: true,
          status: "UNKNOWN",
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!monitor) {
      return res.status(404).json({
        success: false,
        error: "Monitor not found",
        code: 404,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        monitor,
      },
    });
  } catch (error) {
    next(error);
  }
};

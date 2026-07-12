import Resource from "../models/Resource.js";


export const createResource = async (req, res) => {
  try {
    const {
      name,
      category,
      capacity,
      location,
      description,
    } = req.body;

    const resource = await Resource.create({
      name,
      category,
      capacity,
      location,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Resource Added Successfully",
      resource,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
export const getResources = async (req, res) => {
  try {
    const sort = req.query.sort || "newest";
    const page = Number(req.query.page) || 1;

const limit = Number(req.query.limit) || 10;

const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const category = req.query.category || "";

    const query = {};

    if (search) {

      query.name = {
        $regex: search,
        $options: "i"
      };

    }
    if (category) {

    query.category = category;

}

  const resources = await Resource.find(query)
.sort(sortOption)
.skip(skip)
.limit(limit);
    res.status(200).json({

      success: true,

      count: resources.length,

      resources

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: "Server Error"

    });
    let sortOption = {};
    if (sort === "newest") {

    sortOption = { createdAt: -1 };

}
else if (sort === "oldest") {

    sortOption = { createdAt: 1 };

}
else if (sort === "capacity-high") {

    sortOption = { capacity: -1 };

}
else if (sort === "capacity-low") {

    sortOption = { capacity: 1 };

}
else if (sort === "a-z") {

    sortOption = { name: 1 };

}
else if (sort === "z-a") {

    sortOption = { name: -1 };

}

  }
};
// Get Single Resource
export const getResourceById = async (req, res) => {
  try {

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource Not Found"
      });
    }

    res.status(200).json({
      success: true,
      resource
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success:false,
      message:"Internal Server Error"
    });

  }
};
// Update Resource
export const updateResource = async (req, res) => {
  try {

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource Not Found"
      });
    }

    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: "Resource Updated Successfully",
      resource: updatedResource
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });

  }
};
// Delete Resource
export const deleteResource = async (req, res) => {
  try {

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource Not Found"
      });
    }

    await Resource.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Resource Deleted Successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });

  }
};

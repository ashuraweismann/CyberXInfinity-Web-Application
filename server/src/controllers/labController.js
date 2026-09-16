import Lab from "../models/Lab.js";

// Get all published labs
export const getLabs = async (req, res) => {
  try {
    const labs = await Lab.find({ isPublished: true })
      .select("-theory")
      .sort({ order: 1 });

    return res.status(200).json({
      success: true,
      count: labs.length,
      labs,
    });
  } catch (error) {
    console.error("Get labs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve labs.",
    });
  }
};

// Get a single lab
export const getLabBySlug = async (req, res) => {
  try {
    const lab = await Lab.findOne({
      slug: req.params.slug,
      isPublished: true,
    });

    if (!lab) {
      return res.status(404).json({
        success: false,
        message: "Lab not found.",
      });
    }

    return res.status(200).json({
      success: true,
      lab,
    });
  } catch (error) {
    console.error("Get lab error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve lab.",
    });
  }
};
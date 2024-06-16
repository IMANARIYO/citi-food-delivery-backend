import Order from "../models/Order.js";
import { weekDay } from "../models/Weekday.js";
import { DayCategory } from "../models/dayCategory.js";

const createDayForWeek = async (req, res) => {
  try {
    let { day, dayCategoryNames } = req.body

    // Normalize dayCategoryNames to always be an array
    if (!Array.isArray(dayCategoryNames)) {
      dayCategoryNames = [dayCategoryNames]
    }

    const dayCategoryIds = []

    // Create or find existing DayCategories based on the provided names
    for (const name of dayCategoryNames) {
      let dayCategory = await DayCategory.findOne({ name })

      if (!dayCategory) {
        dayCategory = new DayCategory({
          name,
          foodItems: [], // Assuming foodItems can be added later
          day
        })
        await dayCategory.save()
       
      }
      // Ensure the ID is added to the list
      dayCategoryIds.push(dayCategory._id.toString());
    }

    // Check if the day already exists
    let existingWeek = await weekDay.findOne({ day, })

    if (existingWeek) {
      // Update the existing document
      existingWeek.dayCategoryNames = [
        ...new Set([...existingWeek.dayCategoryNames, ...dayCategoryNames])
      ]
      existingWeek.dayCategories = [
        ...new Set([...existingWeek.dayCategories, ...dayCategoryIds])
      ]
      await existingWeek.save()
      return res.status(200).json({
        message: 'Day already exists. Existing week updated successfully.',
        data: existingWeek
      })
    } else {
      // Create a new Week document
      const newWeekDay = new weekDay({
        day,
        dayCategoryNames,
        dayCategories: dayCategoryIds
      })
      await newWeekDay.save()

      return res.status(201).json({
        message: 'New day created successfully.',
        data: newWeekDay
      })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export { createDayForWeek }

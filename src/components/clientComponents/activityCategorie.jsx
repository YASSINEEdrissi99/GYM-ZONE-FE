import React, { useEffect, useState } from "react";
import axios from "axios";
import Main2 from "../Main2";
import '../../assets/css/activities.css';
import { Link, useParams } from "react-router-dom";

const ActivityCategorie = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const { categoryId } = useParams(); // Use useParams to get the path parameter

  // Fetch activities based on the selected category
  const fetchActivitiesByCategory = async (selectedCategoryId) => {
    try {
      const response = await axios.get(`http://localhost:8000/activities/category/${selectedCategoryId}`);
      console.log('API Response:', response.data); // Log response data for debugging
      setActivities(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setLoading(false);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/categories');
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    fetchCategories();
    console.log("Category from params:", categoryId); // Log the categoryId
    if (categoryId) {
      fetchActivitiesByCategory(categoryId);
    } else {
      setLoading(false); // Handle case where no category ID is provided
    }
  }, [categoryId]);

  if (loading) {
    return (
      <div>
        <Main2 />
        <div className="show_act_cont">
          <div className="filter_show_act">
          <h4>Filter by Day</h4>
          <Link to="/clientActivities" className="filter-link">All days</Link>
          <div className="filter_day">
        <Link to="/ActivityDay/Monday" className="filter-link">Monday </Link>
        <Link to="/ActivityDay/Tuesday" className="filter-link">Tuesday </Link>
        <Link to="/ActivityDay/Wednesday" className="filter-link">Wednesday </Link>
        <Link to="/ActivityDay/Thursday" className="filter-link">Thursday </Link>
        <Link to="/ActivityDay/Friday" className="filter-link">Friday </Link>
        <Link to="/ActivityDay/Saturday" className="filter-link">Saturday </Link>
        <Link to="/ActivityDay/Sunday" className="filter-link">Sunday </Link>
        </div>
            <h4>Filter by Category</h4>
            <Link to="/clientActivities" className="filter-link">All categories</Link>
            <div className="filter_day">
            {categories.map(category => (
              <Link
                key={category._id}
                to={`/ActivityCategorie/${category._id}`}
                className="filter-link"
              >
                {category.name}
              </Link>
            ))}
            </div>
          </div>
          <div className="show_act">
            <div className="alert_noexist">No activities found for this category.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Main2 />
      <div className="show_act_cont">
        <div className="filter_show_act">
        <h4>Filter by Day</h4>
          <Link to="/clientActivities" className="filter-link">All days</Link>
          <div className="filter_day">
        <Link to="/ActivityDay/Monday" className="filter-link">Monday </Link>
        <Link to="/ActivityDay/Tuesday" className="filter-link">Tuesday </Link>
        <Link to="/ActivityDay/Wednesday" className="filter-link">Wednesday </Link>
        <Link to="/ActivityDay/Thursday" className="filter-link">Thursday </Link>
        <Link to="/ActivityDay/Friday" className="filter-link">Friday </Link>
        <Link to="/ActivityDay/Saturday" className="filter-link">Saturday </Link>
        <Link to="/ActivityDay/Sunday" className="filter-link">Sunday </Link>
        </div>
          <h4>Filter by Category</h4>
          <Link to="/clientActivities" className="filter-link">All categories</Link>
          <div className="filter_day">
          {categories.map(category => (
              <Link
                key={category._id}
                to={`/ActivityCategorie/${category._id}`}
                className="filter-link"
              >
                {category.name}
              </Link>
            ))}
            
          </div>
        </div>
        <div className="show_act">
          {activities.length === 0 ? (
            <div className="alert_noexist">No activities found for this category.</div>
          ) : (
            activities.map(activity => {
              const imageUrl = activity.image ? `http://localhost:8000/${activity.image.replace(/\\/g, '/')}` : null;

              return (
                <div key={activity._id} className="box_grid">
                  {imageUrl && (
                    <img src={imageUrl} alt={activity.name} />
                  )}
                  <h2>{activity.name}</h2>
                  <Link to={`/Clientacti_detail/${activity._id}`} className="linkchow">See More Details</Link>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityCategorie;

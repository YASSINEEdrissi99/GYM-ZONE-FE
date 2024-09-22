import React, { useEffect, useState } from "react";
import axios from "axios";
import Main2 from "../Main2";
import '../../assets/css/activities.css';
import { Link, useSearchParams } from "react-router-dom";

const ActivityDay = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [day, setDay] = useState('Monday'); // Default day or set to initial value
  const [searchParams] = useSearchParams();

  // Fetch activities based on the selected day
  const fetchActivities = async (selectedDay) => {
    try {
      const response = await axios.get(`http://localhost:8000/activities/day/${selectedDay}`);
      setActivities(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setLoading(true);
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
    // Retrieve the day from query parameters or use default
    fetchCategories();
    const dayFromParams = searchParams.get('day') || day;
    setDay(dayFromParams);
    fetchActivities(dayFromParams);
  }, [searchParams, day]);

  if (loading) {
    return (
      <div>
        <Main2 />
        <div className="show_act_cont">
          <div className="filter_show_act">
            <h4>Filter by Day</h4>
            <Link to="/clientActivities" className="filter-link">All days</Link>
            <div className="filter_day">
              <Link to="?day=Monday" className="filter-link">Monday</Link>
              <Link to="?day=Tuesday" className="filter-link">Tuesday</Link>
              <Link to="?day=Wednesday" className="filter-link">Wednesday</Link>
              <Link to="?day=Thursday" className="filter-link">Thursday</Link>
              <Link to="?day=Friday" className="filter-link">Friday</Link>
              <Link to="?day=Saturday" className="filter-link">Saturday</Link>
              <Link to="?day=Sunday" className="filter-link">Sunday</Link>
            </div>
            <h4>Filter by Category</h4>
          <Link to="/clientActivities" className="filter-link link_all">All categories</Link>
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
            <div className="alert_noexist">No activities found for this day.</div>
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
          <Link to="/clientActivities" className="filter-link link_all">All days</Link>
          <div className="filter_day">
            <Link to="?day=Monday" className="filter-link">Monday</Link>
            <Link to="?day=Tuesday" className="filter-link">Tuesday</Link>
            <Link to="?day=Wednesday" className="filter-link">Wednesday</Link>
            <Link to="?day=Thursday" className="filter-link">Thursday</Link>
            <Link to="?day=Friday" className="filter-link">Friday</Link>
            <Link to="?day=Saturday" className="filter-link">Saturday</Link>
            <Link to="?day=Sunday" className="filter-link">Sunday</Link>
          </div>
          <h4>Filter by Category</h4>
          <Link to="/clientActivities" className="filter-link link_all">All categories</Link>
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
          {activities.map(activity => {
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
          })}
        </div>
      </div>
    </div>
  );
};

export default ActivityDay;

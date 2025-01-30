"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
}

const Dashboard = () => {
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [experienceData, setExperienceData] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data.");
        }

        const { profile } = await response.json();
        setFullName(profile.fullName || "");
        setBio(profile.bio || "");
        setSkills(
          profile.skills.map((skill: any) => skill.name).join(", ") || ""
        );
        setExperienceData(
          profile.experience || [
            {
              id: "",
              title: "",
              company: "",
              startDate: "",
              endDate: "",
              description: "",
            },
          ]
        );
      } catch (error) {
        setError("Could not load profile. Please try again.");
      }
    };

    fetchProfileData();
  }, [router]);

  const handleExperienceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    setExperienceData((prevData) =>
      prevData.map((exp, i) => (i === index ? { ...exp, [name]: value } : exp))
    );
  };

  const handleAddExperience = () => {
    setExperienceData((prevData) => [
      ...prevData,
      {
        id: "",
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const handleRemoveExperience = (index: number) => {
    setExperienceData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to submit your profile.");
        return;
      }

      const payload = {
        fullName,
        bio,
        skills: skills.split(",").map((skill) => skill.trim()),
        experience: experienceData,
      };

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit profile.");
      }

      alert("Profile updated successfully!");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Your Dashboard</h1>

      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.columnContainer}>
          <div>
            <label htmlFor="fullName" className={styles.label}>
              Full Name:
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={styles.input}
            />
          </div>

          <div>
            <label htmlFor="bio" className={styles.label}>
              Bio:
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={styles.textarea}
            />
          </div>
        </div>

        <div>
          <label htmlFor="skills" className={styles.label}>
            Skills (comma separated):
          </label>
          <input
            type="text"
            id="skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className={styles.input}
          />
        </div>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Experience</legend>

          {experienceData.map((exp, index) => (
            <div key={index} className={styles.experienceSection}>
              <div className={styles.columnContainer}>
                <div>
                  <label htmlFor={`title-${index}`} className={styles.label}>
                    Job Title:
                  </label>
                  <input
                    type="text"
                    id={`title-${index}`}
                    name="title"
                    value={exp.title}
                    onChange={(e) => handleExperienceChange(e, index)}
                    className={styles.input}
                  />
                </div>
                <div>
                  <label htmlFor={`company-${index}`} className={styles.label}>
                    Company:
                  </label>
                  <input
                    type="text"
                    id={`company-${index}`}
                    name="company"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(e, index)}
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.columnContainer}>
                <div>
                  <label
                    htmlFor={`startDate-${index}`}
                    className={styles.label}
                  >
                    Start Date:
                  </label>
                  <input
                    type="date"
                    id={`startDate-${index}`}
                    name="startDate"
                    value={exp.startDate}
                    onChange={(e) => handleExperienceChange(e, index)}
                    className={styles.input}
                  />
                </div>
                <div>
                  <label htmlFor={`endDate-${index}`} className={styles.label}>
                    End Date:
                  </label>
                  <input
                    type="date"
                    id={`endDate-${index}`}
                    name="endDate"
                    value={exp.endDate || ""}
                    onChange={(e) => handleExperienceChange(e, index)}
                    className={styles.input}
                  />
                </div>
              </div>
              <label htmlFor={`description-${index}`} className={styles.label}>
                Description:
              </label>
              <textarea
                id={`description-${index}`}
                name="description"
                value={exp.description}
                onChange={(e) => handleExperienceChange(e, index)}
                className={styles.textarea}
              />
              <button
                type="button"
                onClick={() => handleRemoveExperience(index)}
                className={styles.removeButton}
              >
                Remove Experience
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddExperience}
            className={styles.addButton}
          >
            Add Experience
          </button>
        </fieldset>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default Dashboard;

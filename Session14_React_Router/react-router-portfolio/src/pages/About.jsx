import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/About.css';

function About() {
  const experiences = [
    {
      year: '2023 - Present',
      role: 'Senior Full-Stack Developer',
      company: 'Tech Innovations Inc.',
      description: 'Leading development of enterprise-level web applications using React and Node.js.'
    },
    {
      year: '2021 - 2023',
      role: 'Frontend Developer',
      company: 'Digital Solutions Co.',
      description: 'Built responsive web applications and improved performance by 40%.'
    },
    {
      year: '2019 - 2021',
      role: 'Junior Developer',
      company: 'StartUp Labs',
      description: 'Contributed to multiple projects and learned modern web development practices.'
    }
  ];

  const education = [
    {
      year: '2015 - 2019',
      degree: 'Bachelor of Computer Science',
      institution: 'University of Technology',
      description: 'Graduated with honors, focusing on software engineering and web technologies.'
    }
  ];

  const skills = {
    frontend: ['React', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Sass', 'Redux', 'React Router'],
    backend: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST APIs', 'GraphQL', 'Firebase'],
    tools: ['Git', 'Docker', 'AWS', 'Webpack', 'Parcel', 'Jest', 'VS Code', 'Figma']
  };

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About Me</h1>
          <p className="about-subtitle">Passionate Developer, Creative Problem Solver</p>
        </div>
      </section>

      {/* Introduction */}
      <section className="about-intro">
        <div className="intro-content">
          <div className="intro-text">
            <h2>Hello! I'm Ayush</h2>
            <p>
              I'm a full-stack developer with over 5 years of experience creating web applications
              that deliver exceptional user experiences. My journey in tech began with a curiosity
              about how websites work, and it has evolved into a passion for building scalable,
              efficient, and beautiful digital solutions.
            </p>
            <p>
              I specialize in React and Node.js, but I'm always eager to learn new technologies
              and frameworks. I believe in writing clean, maintainable code and following best
              practices to ensure the long-term success of every project.
            </p>
            <p>
              When I'm not coding, you can find me exploring new technologies, contributing to
              open-source projects, or sharing my knowledge through blog posts and mentoring.
            </p>
          </div>
          <div className="intro-image">
            <div className="image-placeholder">
              <div className="profile-icon">👨‍💻</div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="experience-section">
        <h2>Professional Experience</h2>
        <div className="timeline">
          {experiences.map((exp, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <span className="timeline-year">{exp.year}</span>
                <h3>{exp.role}</h3>
                <h4>{exp.company}</h4>
                <p>{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="education-section">
        <h2>Education</h2>
        <div className="timeline">
          {education.map((edu, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <span className="timeline-year">{edu.year}</span>
                <h3>{edu.degree}</h3>
                <h4>{edu.institution}</h4>
                <p>{edu.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="skills-section">
        <h2>Technical Skills</h2>
        <div className="skills-categories">
          <div className="skill-category-card">
            <div className="category-icon">🎨</div>
            <h3>Frontend Development</h3>
            <div className="skills-list">
              {skills.frontend.map((skill, index) => (
                <span key={index} className="skill-badge">{skill}</span>
              ))}
            </div>
          </div>

          <div className="skill-category-card">
            <div className="category-icon">⚙️</div>
            <h3>Backend Development</h3>
            <div className="skills-list">
              {skills.backend.map((skill, index) => (
                <span key={index} className="skill-badge">{skill}</span>
              ))}
            </div>
          </div>

          <div className="skill-category-card">
            <div className="category-icon">🛠️</div>
            <h3>Tools & Technologies</h3>
            <div className="skills-list">
              {skills.tools.map((skill, index) => (
                <span key={index} className="skill-badge">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="values-section">
        <h2>What Drives Me</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">💡</div>
            <h3>Innovation</h3>
            <p>Always exploring new technologies and finding creative solutions to complex problems.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🎯</div>
            <h3>Quality</h3>
            <p>Writing clean, maintainable code and delivering products that exceed expectations.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🤝</div>
            <h3>Collaboration</h3>
            <p>Working with teams to achieve common goals and sharing knowledge with others.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">📈</div>
            <h3>Growth</h3>
            <p>Continuously learning and improving my skills to stay current in the ever-evolving tech landscape.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <h2>Interested in Working Together?</h2>
        <p>Let's discuss how I can help bring your project to life.</p>
        <Link to="/contact" className="btn btn-primary">
          Get In Touch
        </Link>
      </section>
    </div>
  );
}

export default About;

import React from "react";
import { T } from "react-polyglot-hooks";

export default function DashboardNav() {
  return (
    <nav className="dasboard-nav">
      <ul>
        <li>
          <a href="/dashboard">
            <T phrase="dashboard" />
          </a>
        </li>
        <ul>
          <li>
            <a href="/dashboard/users">
              <T phrase="users" />
            </a>
          </li>
          <li>
            <a href="/audio-library">
              <T phrase="audioLibrary" />
            </a>
          </li>
          <li>
            <a href="/upload-files">
              <T phrase="uploadFiles" />
            </a>
          </li>
          <li>
            <a href="/micro">
              <T phrase="micro" />
            </a>
          </li>
          <li>
            <a href="/radio">
              <T phrase="radio" />
            </a>
          </li>
        </ul>
      </ul>
    </nav>
  );
}

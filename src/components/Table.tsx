"use client";
import React, { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomModal from "./CustomModal";
import Pagination from "./Pagination";

const validationSchema = Yup.object().shape({
  projectName: Yup.string().required("Project Name is required"),
  description: Yup.string().required("Description is required"),
  team: Yup.string().required("Team is required"),
  assignedDate: Yup.date().required("Assigned Date is required"),
  dueDate: Yup.date().required("Due Date is required"),
  status: Yup.string().required("Status is required"),
  priority: Yup.string().required("Priority is required"),
  imageUrl: Yup.string().url("Invalid URL").required("Image URL is required"),
});

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Table: React.FC = () => {
  const { data, mutate } = useSWR("http://localhost:3001/projects", fetcher);
  const [currentProject, setCurrentProject] = useState<any | null>(null);
  const [isViewing, setIsViewing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 10;

  const totalPages = 2;

  const currentProjects = data
    ?.filter((project: any) =>
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    ?.slice((currentPage - 1) * projectsPerPage, currentPage * projectsPerPage);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/projects/${id}`);
      mutate();
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  const handleEdit = (project: any) => {
    setCurrentProject(project);
    setIsViewing(false);
    setIsModalOpen(true);
  };

  const handleView = (project: any) => {
    setCurrentProject(project);
    setIsViewing(true);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setCurrentProject(null);
    setIsViewing(false);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      if (currentProject && !isViewing) {
        await axios.put(
          `http://localhost:3001/projects/${currentProject.id}`,
          values
        );
        toast.success("Project updated successfully");
      } else {
        await axios.post("http://localhost:3001/projects", values);
        toast.success("Project created successfully");
      }
      setIsModalOpen(false);
      mutate();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Projects..."
          className="border p-2 rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <button
        onClick={handleCreate}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        + New Project
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Image</th>
              <th className="py-2">Project Name</th>
              <th className="py-2">Description</th>
              <th className="py-2">Team</th>
              <th className="py-2">Assigned Date</th>
              <th className="py-2">Due Date</th>
              <th className="py-2">Status</th>
              <th className="py-2">Priority</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects?.map((project) => (
              <tr key={project.id} className="hover:bg-gray-100">
                <td className="px-4 py-2">
                  <img
                    src={project.imageUrl}
                    alt={project.projectName}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                </td>
                <td className="px-4 py-2">{project.projectName}</td>
                <td className="px-4 py-2">{project.description}</td>
                <td className="px-4 py-2">{project.team}</td>
                <td className="px-4 py-2">{project.assignedDate}</td>
                <td className="px-4 py-2">{project.dueDate}</td>
                <td className="px-4 py-2">{project.status}</td>
                <td className="px-4 py-2">{project.priority}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <FaEdit
                    className="text-blue-500 cursor-pointer hover:text-blue-700"
                    onClick={() => handleEdit(project)}
                  />
                  <FaTrash
                    className="text-red-500 cursor-pointer hover:text-red-700"
                    onClick={() => handleDelete(project.id)}
                  />
                  <FaEye
                    className="text-green-500 cursor-pointer hover:text-green-700"
                    onClick={() => handleView(project)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Formik
          initialValues={{
            projectName: currentProject ? currentProject.projectName : "",
            description: currentProject ? currentProject.description : "",
            team: currentProject ? currentProject.team : "",
            assignedDate: currentProject ? currentProject.assignedDate : "",
            dueDate: currentProject ? currentProject.dueDate : "",
            status: currentProject ? currentProject.status : "",
            priority: currentProject ? currentProject.priority : "",
            imageUrl: currentProject ? currentProject.imageUrl : "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="space-y-4 mb-8">
              <div>
                <label>Project Name</label>
                <Field
                  name="projectName"
                  className={`border p-2 rounded w-full ${
                    errors.projectName && touched.projectName
                      ? "border-red-500"
                      : ""
                  }`}
                  disabled={isViewing}
                />
                <ErrorMessage
                  name="projectName"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div>
                <label>Description</label>
                <Field
                  name="description"
                  className={`border p-2 rounded w-full ${
                    errors.description && touched.description
                      ? "border-red-500"
                      : ""
                  }`}
                  disabled={isViewing}
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div>
                <label>Team</label>
                <Field
                  name="team"
                  className={`border p-2 rounded w-full ${
                    errors.team && touched.team ? "border-red-500" : ""
                  }`}
                  disabled={isViewing}
                />
                <ErrorMessage
                  name="team"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div>
                <label>Assigned Date</label>
                <Field
                  name="assignedDate"
                  type="date"
                  className={`border p-2 rounded w-full ${
                    errors.assignedDate && touched.assignedDate
                      ? "border-red-500"
                      : ""
                  }`}
                  disabled={isViewing}
                />
                <ErrorMessage
                  name="assignedDate"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div>
                <label>Due Date</label>
                <Field
                  name="dueDate"
                  type="date"
                  className={`border p-2 rounded w-full ${
                    errors.dueDate && touched.dueDate ? "border-red-500" : ""
                  }`}
                  disabled={isViewing}
                />
                <ErrorMessage
                  name="dueDate"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div>
                <label>Status</label>
                <Field
                  name="status"
                  className={`border p-2 rounded w-full ${
                    errors.status && touched.status ? "border-red-500" : ""
                  }`}
                  disabled={isViewing}
                />
                <ErrorMessage
                  name="status"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div>
                <label>Priority</label>
                <Field
                  name="priority"
                  className={`border p-2 rounded w-full ${
                    errors.priority && touched.priority ? "border-red-500" : ""
                  }`}
                  disabled={isViewing}
                />
                <ErrorMessage
                  name="priority"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div>
                <label>Image URL</label>
                <Field
                  name="imageUrl"
                  className={`border p-2 rounded w-full ${
                    errors.imageUrl && touched.imageUrl ? "border-red-500" : ""
                  }`}
                  disabled={isViewing}
                />
                <ErrorMessage
                  name="imageUrl"
                  component="div"
                  className="text-red-500"
                />
              </div>
              {!isViewing && (
                <div className="flex justify-end space-x-4">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </CustomModal>
    </div>
  );
};

export default Table;

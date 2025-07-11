import { EditOutlined } from "@ant-design/icons";
import { DeleteForeverOutlined } from "@mui/icons-material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { enqueueSnackbar } from "notistack";
import categoryApi from "../../api/categoryApi";

interface Category {
  id: number;
  name: string;
  description: string;
}

const TableCategory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [keyword, setKeyword] = React.useState("");

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const response = await categoryApi.getAll();
      console.log(response.data);
      setCategories(response.data.result);
      if (response.data.code === 503) {
        enqueueSnackbar(response.data.message, { variant: "error" });
      }
    } catch (error) {
      console.error("Failed to fetch category:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterCategory = async () => {
    setLoading(true);
    try {
      const response = await categoryApi.search(keyword);
      console.log(response.data);
      setCategories(response.data.result);
      if (response.data.code === 503) {
        enqueueSnackbar(response.data.message, { variant: "error" });
      }
    } catch (error) {
      console.error("Failed to fetch category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: any) => {
    setLoading(true);
    try {
      const response = await categoryApi.delete(id);
      console.log(response);
      if (response.data.code === 400) {
        enqueueSnackbar(response.data.message, { variant: "error" });
        return;
      }
      if (response.data.code !== 400) {
        const newCategories = categories.filter(
          (category) => category.id !== id
        );
        setCategories(newCategories);
        enqueueSnackbar("Category deleted successfully!", {
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
      enqueueSnackbar("Failed to delete category!", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <div className="rounded-md border border-gray-300 bg-white shadow-sm ">
      <div className="py-6 px-4 md:px-6 xl:px-7 flex justify-between">
        {/* <h4 className='text-xl font-semibold text-black'>List Collections</h4> */}
        <div className="mt-2 flex items-center justify-between max-w-[400px] gap-4">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md py-2 px-4"
            placeholder="Search category..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button
            className="bg-black text-white px-6 py-2 rounded-md"
            onClick={() => {
              filterCategory();
            }}
          >
            Search
          </button>
        </div>
        {/* <button
          className="bg-gray-500 text-white px-6 py-2 rounded-md"
          onClick={() => {
            navigate(-1);
          }}
        >
          Back
        </button> */}
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left">
              <th className="min-w-[220px] py-2 px-4 font-semibold text-black xl:pl-11">
                Category Name
              </th>
              <th className="py-2 px-4 font-semibold text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories &&
              categories.length > 0 &&
              categories.map((categoryItem, key) => (
                <tr key={key}>
                  <td className="border-b border-[#eee] py-2 px-4 pl-9 xl:pl-11">
                    <p className="text-sm text-black">{categoryItem.name}</p>
                  </td>

                  <td className="border-b border-[#eee] py-2 px-4">
                    <div className="flex items-center space-x-3.5">
                      {/* Add button */}
                      {/* <div className='relative group'>
											<button
												className='hover:text-green-500'
												onClick={() => navigate('/admin/brands/add-collection')}
											>
												<Add className='w-5 h-5' />
											</button>
											<span className='absolute opacity-0 group-hover:opacity-100 bg-black text-white text-xs rounded py-1 px-2 -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap'>
												Add collection
											</span>
										</div> */}

                      {/* Edit button */}
                      <div className="relative group">
                        <button
                          className="hover:text-yellow-500"
                          onClick={() => {
                            navigate(`/categories/${categoryItem.id}/edit`);
                          }}
                        >
                          <EditOutlined className="w-5 h-5" />
                        </button>
                        <span className="absolute opacity-0 group-hover:opacity-100 bg-black text-white text-xs rounded py-1 px-2 -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                          Edit
                        </span>
                      </div>

                      {/* Delete button */}
                      <div className="relative group">
                        <button
                          className="hover:text-red-500"
                          onClick={() => handleDelete(categoryItem.id)}
                        >
                          <DeleteForeverOutlined className="w-5 h-5" />
                        </button>
                        <span className="absolute opacity-0 group-hover:opacity-100 bg-black text-white text-xs rounded py-1 px-2 -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                          Remove
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableCategory;

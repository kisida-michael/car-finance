import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const AdminDashboard = () => {
  return (
    <div className="w-full bg-admin p-4 min-h-screen text-gray-200">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex items-center">
          <button>
            <FiChevronLeft className="text-xl" />
          </button>
          <span className="mx-2">April 2023</span>
          <button>
            <FiChevronRight className="text-xl" />
          </button>
        </div>
      </header>

      <div className="grid grid-rows-12 gap-8 mt-8">
        {/* KPIs */}
        <div className="col-span-12 md:col-span-2 lg:col-span-2">
          <div className="grid grid-cols-4 gap-4">
            {/* Replace these placeholders with your KPI components */}
            <div className="bg-card p-4 rounded-lg">KPI 1</div>
            <div className="bg-card p-4 rounded-lg">KPI 2</div>
            <div className="bg-card p-4 rounded-lg">KPI 3</div>
            <div className="bg-card p-4 rounded-lg">KPI 4</div>
          </div>
        </div>

        {/* Table and analytics KPI */}
        <div className="col-span-12 md:col-span-5 lg:col-span-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 bg-card p-4 rounded-lg">Table</div>
            <div className="bg-card p-4 rounded-lg">Analytics KPI</div>
          </div>
        </div>

        {/* Full-width table */}
        <div className="col-span-12 md:col-span-5 lg:col-span-4">
          <div className="bg-card p-4 rounded-lg">Full-width table</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  MenuItem,
  Select,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CreateClassroomModal from "@/components/modal/createClassroomModal";


const ClassroomListComponents = () => {
  const router = useRouter();
  const [openCreate, setOpenCreate] = useState<boolean>(false);


  return (
    <div className="min-h-screen px-8 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h2>All Classroom</h2>

        <div className="flex items-center gap-3">
            <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreate(true)}
          >
            Create Classroom
          </Button>

          <Select
            size="small"
            defaultValue="all"
            sx={{
              width: 140,
              height: 46,
            }}
            IconComponent={ExpandMoreIcon}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="1/2025">1/2025</MenuItem>
            <MenuItem value="2/2025">2/2025</MenuItem>
          </Select>
        </div>
      </div>


      {openCreate && (
        <CreateClassroomModal
          open={openCreate}
          onClose={() => setOpenCreate(false)}
        />
      )}
    </div>
  );
};

export default ClassroomListComponents;

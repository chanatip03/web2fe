"use client";

import {
    Dialog,
    DialogContent,
    Button,
} from "@mui/material";
import ErrorIcon from '@mui/icons-material/Error';

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function ConfirmNoTestCaseModal({
    open,
    onClose,
    onConfirm,
}: Props) {
    return (
        <Dialog
            open={open}
            onClose={(_, reason) => {
                if (reason === "backdropClick") return;
                onClose();
            }}
            slotProps={{
                paper: {
                    sx: {
                        width: 400,
                        height:370,
                        borderRadius: "12px",
                    },
                },
            }}
        >
            <DialogContent>
            <div className="py-6 px-4">
                <div className="flex justify-center mb-4">
                    <ErrorIcon
                        sx={{
                            fontSize: "100px",
                            color: "var(--color-primary03)",
                        }}
                    />
                </div>

                <div className="w-[330px] mb-6">
                    <p className="p2">
                        No test cases have been uploaded. Do you still want to create this assignment? You can add test cases later in the assignment page.
                    </p>
                </div>

                <div className="flex gap-4">

                    <Button
                        variant="outlined"
                        onClick={onClose}
                        className="!w-1/2"
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={onConfirm}
                        className="!w-1/2"
                    >
                        Confirm
                    </Button>

                </div>
            </div>
            </DialogContent>
        </Dialog>
    );
}
"use client";
import { Button } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const ResumeParserProgress = () => {
  const [isParsingDone, setIsParsingDone] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  console.log("parser");
  const fetchResumeParsingProgress = useCallback(async () => {
    setIsLoading(true);
    fetch("/api/resume/parse-progress")
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        if (response.message === "in-progress") {
          setTimeout(() => {
            fetchResumeParsingProgress();
          }, 12000);
        } else if (response.message === "completed") {
          setIsParsingDone(true);
        }
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      });
  }, []);
  useEffect(() => {
    fetchResumeParsingProgress();
  }, []);

  return (
    <div className="px-4 py-2 border rounded-md border-brown-700 bg-brown-300 flex items-center justify-between">
      <div>
        <h2 className="text-lg mb-1 font-bold">
          {!isParsingDone
            ? "Sit back and relax!"
            : "Resume parsing is completed!"}
        </h2>
        <p className="text-sm text-gray-600 font-normal">
          {!isParsingDone
            ? "The resume is being parsed by our state-of-the-art AI. We will notify you once this is done. Explore the dashboard till then."
            : "Your resume is parsed. Check it out!"}
        </p>
      </div>
      <div>
        <Link href={"/user"}>
          <Button type="primary" disabled={!isParsingDone} loading={isLoading}>
            View my information
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ResumeParserProgress;

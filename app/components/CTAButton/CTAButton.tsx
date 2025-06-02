import React from "react";
import Link from "next/link";
import styles from "./CTAButton.module.css";

const CTAButton = () => {
  return (
    <Link className={styles.button} href={"/signup"}>
      SIGN UP
    </Link>
  );
};

export default CTAButton;

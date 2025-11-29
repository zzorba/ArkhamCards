import { Entity, Column, PrimaryColumn } from 'typeorm/browser';

/**
 * Represents investigator code relationships - allows looking up all alternate
 * versions of an investigator by any code in the set.
 *
 * Each investigator code gets its own row with the full list of related codes.
 * This denormalized structure enables fast lookups when you only have a code
 * and need to find all related investigators (parallel, alternate art, reprints, etc.)
 */
@Entity('investigator_set')
export default class InvestigatorSet {
  @PrimaryColumn('text')
  public code!: string;

  @Column('simple-array')
  public alternate_codes!: string[];

  /**
   * Create an InvestigatorSet entry for a specific code.
   * @param code The investigator code for this row
   * @param alternate_codes Array of ALL related codes (including this one)
   */
  static create(code: string, alternate_codes: string[]): InvestigatorSet {
    return {
      code,
      alternate_codes,
    };
  }

  /**
   * Get all related codes except the current one.
   * Useful for filtering out related investigators.
   */
  getOtherCodes(): string[] {
    return this.alternate_codes.filter(c => c !== this.code);
  }

  /**
   * Get all codes including the current one.
   */
  getAllCodes(): string[] {
    return this.alternate_codes;
  }
}

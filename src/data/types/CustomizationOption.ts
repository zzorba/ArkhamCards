import { map } from 'lodash';
import { Column } from 'typeorm/browser';

const LINE_REGEX = /□+\s+\<b\>(.+?)\<\/b\>\s+(.+)/;


export interface CustomizationChoice {
  xp_spent: number;
  xp_locked: number;
  unlocked: boolean;
  option: CustomizationOption;
  choice?: string;
}

export default class CustomizationOption {
  @Column('integer', { nullable: true })
  public xp?: number;

  @Column('text', { nullable: true })
  public real_traits?: string;

  @Column('text', { nullable: true })
  public real_slot?: string;

  @Column('text', { nullable: true })
  public real_text?: string;

  @Column('integer', { nullable: true })
  public health?: number;

  @Column('integer', { nullable: true })
  public sanity?: number;

  @Column('integer', { nullable: true })
  public cost?: number;

  @Column('text', { nullable: true })
  public choice?: string;

  @Column('integer', { nullable: true })
  public deck_limit?: number;

  @Column('text', { nullable: true })
  public text_change?: string;

  @Column('integer', { nullable: true })
  public position?: number;

  @Column('integer')
  public index!: number;

  // Derived from localized text
  @Column('text', { nullable: true })
  public title?: string;

  @Column('text', { nullable: true })
  public text?: string;

  @Column('text', { nullable: true })
  public text_edit?: string;

  static parse(json: any, index: number, lines: string[], change_lines: string[]): CustomizationOption {
    const option = new CustomizationOption();

    option.xp = json.xp;
    option.real_traits = json.real_traits;
    option.real_slot = json.real_slot;
    option.real_text = json.real_text;
    option.health = json.health;
    option.sanity = json.sanity;
    option.cost = json.cost;
    option.choice = json.choice;
    option.deck_limit = json.deck_limit;
    option.text_change = json.text_change;
    option.position = json.position;

    option.index = index;
    const line = lines[index];
    if (line) {
      const match = line.match(LINE_REGEX);
      if (match) {
        option.title = match[1];
        option.text = match[2];
      }
    }
    const change = change_lines[index];
    if (change) {
      option.text_edit = change;
    }
    return option;
  }

  static parseAll(json: any): CustomizationOption[] | undefined {
    if (!json.customization_options) {
      return undefined;
    }
    const lines = (json.customization_text || '').split('\n');
    const change_lines = (json.customization_change || '').split('\n');
    return map(json.customization_options as any[], (option, index) => {
      return CustomizationOption.parse(option, index, lines, change_lines);
    });
  }
}
